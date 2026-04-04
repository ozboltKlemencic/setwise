"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { NutritionBuilderClientPicker } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-picker"
import { nutritionBuilderClientOptions } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import {
  GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
  resolveProgramPlanStorageScopeFromPath,
  upsertStoredProgramPlan,
} from "@/lib/handlers/program-plan-storage"
import {
  readStoredProgramTemplate,
  readStoredProgramTemplates,
  upsertStoredProgramTemplate,
} from "@/lib/handlers/program-template-storage"
import {
  isGlobalProgramsBuilderBackHref,
  isProgramsTemplatesBuilderBackHref,
  resolveProgramsTemplatesBackHref,
} from "@/lib/handlers/programs.handlers"
import {
  buildProgramBuilderInitialProgramFromStoredPlan,
  buildStoredProgramPlanFromBuilderState,
} from "@/lib/programs/program-plan-storage.utils"
import { programBuilderPresets } from "@/lib/programs/program-builder.utils"
import { useProgramBuilder } from "@/hooks/programs/use-program-builder"
import type {
  FixedProgramEditorProgram,
  StoredProgramBuilderSnapshot,
} from "@/types"

const EMPTY_CLIENT_IDS: string[] = []

function areClientIdsEqual(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((clientId, index) => clientId === right[index])
  )
}

function buildNextSavedTemplateTitle(title: string, existingTitles: string[]) {
  const resolvedTitle = title.trim() || "New Program"

  if (!existingTitles.includes(resolvedTitle)) {
    return resolvedTitle
  }

  let nextIndex = 1
  let nextTitle = `${resolvedTitle} - copy-${nextIndex}`

  while (existingTitles.includes(nextTitle)) {
    nextIndex += 1
    nextTitle = `${resolvedTitle} - copy-${nextIndex}`
  }

  return nextTitle
}

type ProgramBuilderPageViewProps = {
  initialProgram: FixedProgramEditorProgram
  backHref: string
  initialSnapshot?: StoredProgramBuilderSnapshot | null
  initialAssignedClientIds?: string[]
  initialTemplateId?: string
  createdAt?: string
  isEditMode?: boolean
}

const ProgramBuilderWorkspace = React.lazy(async () => {
  const module = await import("@/components/coachWise/clients/programs/builder")

  return { default: module.ProgramBuilderWorkspace }
})

export function ProgramBuilderPageView({
  initialProgram,
  backHref,
  initialSnapshot,
  initialAssignedClientIds,
  initialTemplateId,
  createdAt,
  isEditMode = false,
}: ProgramBuilderPageViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sourceProgram, setSourceProgram] = React.useState(initialProgram)
  const [sourceSnapshot, setSourceSnapshot] = React.useState<StoredProgramBuilderSnapshot | null | undefined>(
    initialSnapshot
  )
  const builder = useProgramBuilder(sourceProgram, sourceSnapshot)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [title, setTitle] = React.useState(initialProgram.title)
  const [isEditingTitle, setIsEditingTitle] = React.useState(false)

  React.useEffect(() => {
    setSourceProgram(initialProgram)
    setSourceSnapshot(initialSnapshot)
  }, [initialProgram, initialSnapshot])

  React.useEffect(() => {
    if (!initialTemplateId) {
      return
    }

    const storedTemplate = readStoredProgramTemplate(initialTemplateId)
    if (!storedTemplate) {
      return
    }

    const nextProgram = buildProgramBuilderInitialProgramFromStoredPlan(storedTemplate)
    setSourceProgram({
      ...nextProgram,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `program-template-seed-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    })
    setSourceSnapshot(storedTemplate.builderSnapshot ?? null)
  }, [initialTemplateId])

  React.useEffect(() => {
    setTitle(sourceProgram.title)
    setIsEditingTitle(false)
  }, [sourceProgram.id, sourceProgram.title])

  React.useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditingTitle])

  const resolvedProgram = React.useMemo(
    () => ({
      ...sourceProgram,
      title: title.trim() || sourceProgram.title,
    }),
    [sourceProgram, title]
  )

  const handleTitleBlur = React.useCallback(() => {
    setTitle((currentTitle) => currentTitle.trim() || sourceProgram.title)
    setIsEditingTitle(false)
  }, [sourceProgram.title])

  const handleTitleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault()
        handleTitleBlur()
      }

      if (event.key === "Escape") {
        event.preventDefault()
        setTitle(sourceProgram.title)
        setIsEditingTitle(false)
      }
    },
    [handleTitleBlur, sourceProgram.title]
  )

  const storageScopeId = React.useMemo(
    () =>
      resolveProgramPlanStorageScopeFromPath(backHref) ??
      resolveProgramPlanStorageScopeFromPath(pathname),
    [backHref, pathname]
  )
  const stableInitialAssignedClientIds =
    initialAssignedClientIds ?? EMPTY_CLIENT_IDS
  const resolvedAssignedClientIds = React.useMemo(() => {
    if (stableInitialAssignedClientIds.length > 0) {
      return Array.from(new Set(stableInitialAssignedClientIds))
    }

    if (
      sourceSnapshot?.assignedClientIds?.length
    ) {
      return Array.from(new Set(sourceSnapshot.assignedClientIds))
    }

    if (
      storageScopeId &&
      storageScopeId !== GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE &&
      /^\d+$/.test(storageScopeId)
    ) {
      return [storageScopeId]
    }

    return []
  }, [
    stableInitialAssignedClientIds,
    sourceSnapshot?.assignedClientIds,
    storageScopeId,
  ])
  const [assignedClientIds, setAssignedClientIds] = React.useState<string[]>(
    () => resolvedAssignedClientIds
  )
  const showClientPicker = React.useMemo(
    () =>
      !isProgramsTemplatesBuilderBackHref(backHref) &&
      isGlobalProgramsBuilderBackHref(backHref) &&
      nutritionBuilderClientOptions.length > 0,
    [backHref]
  )
  const isTemplatesMode = React.useMemo(
    () => isProgramsTemplatesBuilderBackHref(backHref),
    [backHref]
  )
  const templatesBackHref = React.useMemo(
    () => resolveProgramsTemplatesBackHref(backHref),
    [backHref]
  )

  React.useEffect(() => {
    setAssignedClientIds((currentAssignedClientIds) =>
      areClientIdsEqual(currentAssignedClientIds, resolvedAssignedClientIds)
        ? currentAssignedClientIds
        : resolvedAssignedClientIds
    )
  }, [resolvedAssignedClientIds])

  const handleSave = React.useCallback(() => {
    if (!storageScopeId) {
      toast.error("Unable to save program", {
        description: "No valid storage scope was found for this program.",
      })
      return
    }

    const nextStoredProgram = buildStoredProgramPlanFromBuilderState({
      planId: sourceProgram.id,
      title,
      description: builder.description,
      days: builder.days,
      myReps: builder.myReps,
      myTempos: builder.myTempos,
      showAdvancedSetOptions: builder.showAdvancedSetOptions,
      assignedClientIds,
      createdAt,
    })

    upsertStoredProgramPlan(storageScopeId, nextStoredProgram)
    toast.success("Program saved", {
      description: `${nextStoredProgram.title} is now available in Existing programs.`,
    })
    router.push(backHref)
  }, [
    assignedClientIds,
    backHref,
    builder.days,
    builder.description,
    builder.myReps,
    builder.myTempos,
    builder.showAdvancedSetOptions,
    sourceProgram.id,
    router,
    storageScopeId,
    title,
    createdAt,
  ])

  const handleSaveAsTemplate = React.useCallback(() => {
    const nextTitle = buildNextSavedTemplateTitle(title, [
      ...readStoredProgramTemplates().map((template) => template.title),
      ...programBuilderPresets.map((preset) => preset.title),
    ])
    const nextStoredTemplate = buildStoredProgramPlanFromBuilderState({
      title: nextTitle,
      description: builder.description,
      days: builder.days,
      myReps: builder.myReps,
      myTempos: builder.myTempos,
      showAdvancedSetOptions: builder.showAdvancedSetOptions,
      assignedClientIds: assignedClientIds,
    })

    upsertStoredProgramTemplate(nextStoredTemplate)
    toast.success("Template saved", {
      description: `${nextStoredTemplate.title} is now available in Templates.`,
    })
    router.push(templatesBackHref)
  }, [
    assignedClientIds,
    builder.days,
    builder.description,
    builder.myReps,
    builder.myTempos,
    builder.showAdvancedSetOptions,
    router,
    templatesBackHref,
    title,
  ])

  return (
    <div className="min-h-0 bg-neutral-50">
      <NutritionBuilderNav
        title={resolvedProgram.title}
        isEditingTitle={isEditingTitle}
        inputValue={title}
        inputRef={inputRef}
        onBack={() => router.push(backHref)}
        onStartEditing={() => setIsEditingTitle(true)}
        onTitleChange={setTitle}
        onTitleBlur={handleTitleBlur}
        onTitleKeyDown={handleTitleKeyDown}
        onSave={isTemplatesMode ? handleSaveAsTemplate : handleSave}
        saveLabel={isTemplatesMode ? "Save Template" : "Save Program"}
        leadingActions={
          showClientPicker ? (
            <NutritionBuilderClientPicker
              clients={nutritionBuilderClientOptions}
              selectedClientIds={assignedClientIds}
              onSelectedClientIdsChange={setAssignedClientIds}
            />
          ) : null
        }
        secondaryAction={
          isTemplatesMode || isEditMode
            ? undefined
            : {
                label: "Save as template",
                onClick: handleSaveAsTemplate,
              }
        }
      />

      <div className="min-h-[calc(100vh-var(--header-height)-3rem)] bg-neutral-50">
        <React.Suspense
          fallback={
            <div className="flex min-h-[calc(100vh-var(--header-height)-3rem)] items-center justify-center text-[14px] text-neutral-500">
              Loading program builder...
            </div>
          }
        >
          <ProgramBuilderWorkspace builder={builder} />
        </React.Suspense>
      </div>
    </div>
  )
}
