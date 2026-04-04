"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { NutritionBuilderClientPicker } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-picker"
import { nutritionBuilderClientOptions } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import { ProgramBuilderToolbarMenu } from "@/components/coachWise/clients/programs/builder/program-builder-toolbar-menu"
import { NutritionBuilderNav } from "@/components/coachWise/clients/nutrition/nutrition-builder-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
  resolveProgramPlanStorageScopeFromPath,
  upsertStoredProgramPlan,
} from "@/lib/handlers/program-plan-storage"
import {
  readStoredProgramTemplate,
  upsertStoredProgramTemplate,
} from "@/lib/handlers/program-template-storage"
import { isGlobalProgramsBuilderBackHref } from "@/lib/handlers/programs.handlers"
import {
  buildProgramBuilderInitialProgramFromStoredPlan,
  buildStoredProgramPlanFromBuilderState,
} from "@/lib/programs/program-plan-storage.utils"
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

type ProgramBuilderPageViewProps = {
  initialProgram: FixedProgramEditorProgram
  backHref: string
  initialSnapshot?: StoredProgramBuilderSnapshot | null
  initialAssignedClientIds?: string[]
  initialTemplateId?: string
  createdAt?: string
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
      (isGlobalProgramsBuilderBackHref(backHref) ||
        isGlobalProgramsBuilderBackHref(pathname)) &&
      nutritionBuilderClientOptions.length > 0,
    [backHref, pathname]
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
    const nextStoredTemplate = buildStoredProgramPlanFromBuilderState({
      title,
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
  }, [
    assignedClientIds,
    builder.days,
    builder.description,
    builder.myReps,
    builder.myTempos,
    builder.showAdvancedSetOptions,
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
        onSave={handleSave}
        saveLabel="Save Program"
        leadingActions={
          <>
            {showClientPicker ? (
              <NutritionBuilderClientPicker
                clients={nutritionBuilderClientOptions}
                selectedClientIds={assignedClientIds}
                onSelectedClientIdsChange={setAssignedClientIds}
              />
            ) : null}
            <ProgramBuilderToolbarMenu
              label="Ranges"
              open={builder.showMyReps}
              onOpenChange={(open) => {
                builder.setShowMyReps(open)
                if (open) {
                  builder.setShowMyTempos(false)
                }
              }}
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Ranges
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myReps.map((range, index) => (
                    <div
                      key={`${range}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{range}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomRepRange(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newRepRange}
                    onChange={(event) => builder.setNewRepRange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomRepRange()
                      }
                    }}
                    placeholder="e.g. 5-8"
                    className="h-8 w-24 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomRepRange}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add range
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>

            <ProgramBuilderToolbarMenu
              label="Tempo"
              open={builder.showMyTempos}
              onOpenChange={(open) => {
                builder.setShowMyTempos(open)
                if (open) {
                  builder.setShowMyReps(false)
                }
              }}
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Tempo
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myTempos.map((tempo, index) => (
                    <div
                      key={`${tempo}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{tempo}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomTempo(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newTempo}
                    onChange={(event) => builder.setNewTempo(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomTempo()
                      }
                    }}
                    placeholder="e.g. 3-1-2-0"
                    className="h-8 w-28 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomTempo}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add tempo
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>
          </>
        }
        secondaryAction={{
          label: "Save as template",
          onClick: handleSaveAsTemplate,
        }}
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
