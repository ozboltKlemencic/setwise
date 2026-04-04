"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  IconBarbell,
  IconClipboardList,
  IconLayoutGrid,
  IconPlus,
} from "@tabler/icons-react"
import { Pencil, Trash2 } from "lucide-react"

import clientData from "@/app/[locale]/beta-coach-wise/data.json"
import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import {
  ProgramPlansTable,
  type ProgramPlansTableRow,
} from "@/components/coachWise/tables/program-plans-table"
import { ProgramBuilderCreateExerciseDialog } from "@/components/coachWise/clients/programs/builder/program-builder-create-exercise-dialog"
import { ToolbarSearchInput } from "@/components/coachWise/toolbar-search-input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PROGRAM_EXERCISES_UPDATED_EVENT,
  removeStoredProgramExercise,
  readStoredProgramExercises,
  upsertStoredProgramExercise,
} from "@/lib/handlers/program-exercise-storage"
import {
  ensureStoredProgramPlans,
  GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
  PROGRAM_PLANS_UPDATED_EVENT,
  readStoredProgramPlans,
  removeStoredProgramPlan,
  upsertStoredProgramPlan,
} from "@/lib/handlers/program-plan-storage"
import {
  PROGRAM_TEMPLATES_UPDATED_EVENT,
  removeStoredProgramTemplate,
  readStoredProgramTemplates,
  upsertStoredProgramTemplate,
} from "@/lib/handlers/program-template-storage"
import {
  getProgramsCreateHref,
  getProgramsDetailHref,
  getProgramsEditHref,
} from "@/lib/handlers/programs.handlers"
import {
  createProgramBuilderInitialDays,
  createProgramBuilderLibraryExercise,
  PROGRAM_BUILDER_DEFAULT_REP_RANGES,
  PROGRAM_BUILDER_DEFAULT_TEMPOS,
  PROGRAM_BUILDER_EXERCISES,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
} from "@/lib/programs/program-builder-data"
import { getFixedPrograms } from "@/lib/programs/fixed-programs-data"
import {
  buildStoredProgramPlanFromBuilderState,
  cloneStoredProgramPlan,
  createInitialStoredProgramPlans,
} from "@/lib/programs/program-plan-storage.utils"
import {
  createProgramBuilderInitialProgram,
  formatProgramTemplateSummary,
  formatProgramPresetSummary,
  programBuilderPresets,
} from "@/lib/programs/program-builder.utils"
import { cn } from "@/lib/utils"
import type { ProgramBuilderExerciseLibraryItem, StoredProgramPlan } from "@/types"

type ProgramTab = "programs" | "templates" | "exercises"

const programTabs: Array<{
  value: ProgramTab
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { value: "programs", label: "Programs", icon: IconClipboardList },
  { value: "templates", label: "Templates", icon: IconLayoutGrid },
  { value: "exercises", label: "Exercises", icon: IconBarbell },
]

const profileTabTriggerClassName =
  "h-full flex-none gap-1.5 rounded-none border-0 border-b-2 border-transparent bg-transparent px-3.5 py-2 text-[13.5px] font-normal text-neutral-500 after:hidden hover:text-neutral-700 data-[state=active]:border-(--brand-500) data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3.5 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-(--brand-600)"

function buildNextDuplicatedProgramTitle(title: string, existingTitles: string[]) {
  let nextIndex = 1
  let nextTitle = `${title} - copy ${nextIndex}`

  while (existingTitles.includes(nextTitle)) {
    nextIndex += 1
    nextTitle = `${title} - copy ${nextIndex}`
  }

  return nextTitle
}

function formatExerciseTypeLabel(type: ProgramBuilderExerciseLibraryItem["type"]) {
  return type
    .split("_")
    .map((segment: string) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
}

function buildProgramsBackHrefWithStorageScope(
  backToHref: string,
  storageScopeId?: string
) {
  if (!storageScopeId || storageScopeId === GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE) {
    return backToHref
  }

  const [pathname, queryString = ""] = backToHref.split("?")
  const searchParams = new URLSearchParams(queryString)
  searchParams.set("storageScope", storageScopeId)
  const nextQuery = searchParams.toString()

  return nextQuery ? `${pathname}?${nextQuery}` : pathname
}

function resolveProgramRowClients(
  row: Pick<ProgramPlansTableRow, "assignedClientIds">,
  programClientsByScope: Map<
    string,
    {
      id: string
      name: string
      avatar?: string
    }
  >,
  fallbackStorageScopeId?: string
) {
  const assignedClients = (row.assignedClientIds ?? [])
    .map((clientId) => programClientsByScope.get(clientId))
    .filter(
      (
        client
      ): client is {
        id: string
        name: string
        avatar?: string
      } => Boolean(client)
    )

  if (assignedClients.length > 0) {
    return assignedClients
  }

  if (!fallbackStorageScopeId) {
    return []
  }

  const fallbackClient = programClientsByScope.get(fallbackStorageScopeId)
  return fallbackClient ? [fallbackClient] : []
}

function isPresetTemplateRow(row: ProgramPlansTableRow) {
  return row.id.startsWith("preset:")
}

const exerciseRowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const exerciseDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function formatExerciseEquipmentLabel(exercise: ProgramBuilderExerciseLibraryItem) {
  const equipment = exercise.equipment ?? []

  if (equipment.length === 0) {
    return "-"
  }

  if (equipment.length <= 2) {
    return equipment.join(", ")
  }

  return `${equipment[0]} +${equipment.length - 1}`
}

function ProgramsExercisesTable({
  rows,
  onEditRow,
  onDeleteRow,
}: {
  rows: ProgramBuilderExerciseLibraryItem[]
  onEditRow: (row: ProgramBuilderExerciseLibraryItem) => void
  onDeleteRow: (row: ProgramBuilderExerciseLibraryItem) => void
}) {
  if (!rows.length) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white px-5 py-10 text-center text-[14px] text-neutral-500">
        No exercises found.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="grid grid-cols-[minmax(0,1fr)_9rem_minmax(0,18rem)_10rem_8rem_8.5rem] items-center gap-6 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900">
        <div className="text-left">Exercise</div>
        <div className="text-left">Primary Muscle</div>
        <div className="text-left">Technical Clue</div>
        <div className="text-left">Equipment</div>
        <div className="text-left">Media</div>
        <div className="justify-self-center text-center">Action</div>
      </div>

      <div>
        {rows.map((exercise) => {
          const isCustomExercise = !PROGRAM_BUILDER_EXERCISES.some(
            (libraryExercise) => libraryExercise.id === exercise.id
          )

          return (
            <div
              key={exercise.id}
              className="grid grid-cols-[minmax(0,1fr)_9rem_minmax(0,18rem)_10rem_8rem_8.5rem] items-start gap-6 border-b border-neutral-200 px-5 py-3 last:border-b-0 hover:bg-neutral-50"
            >
              <div className="min-w-0 max-w-[24rem] text-left">
                <div className="truncate text-[15px] font-medium text-neutral-950">
                  {exercise.name}
                </div>
              </div>

              <div className="flex min-h-10 items-center">
                <span
                  className={cn(
                    "inline-flex h-auto rounded-md border px-2.5 py-1 text-[12px] font-medium",
                    PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle]
                  )}
                >
                  {exercise.muscle}
                </span>
              </div>

              <div className="min-w-0 max-w-[18rem] py-0.5 text-[13px] leading-5 text-neutral-500 line-clamp-2">
                {exercise.instructions?.trim()
                  ? exercise.instructions
                  : "No technical clues added yet."}
              </div>

              <div className="flex min-h-10 items-center">
                <span className="inline-flex h-auto rounded-sm border border-neutral-200/80 bg-neutral-100/85 px-2.5 py-1 text-[12px] font-normal text-neutral-600">
                  {formatExerciseEquipmentLabel(exercise)}
                </span>
              </div>

              <div className="flex min-h-10 items-center gap-2">
                {exercise.mediaFileName ? (
                  <span className="inline-flex h-auto rounded-sm border border-neutral-200/80 bg-neutral-100/85 px-2.5 py-1 text-[12px] font-normal text-neutral-600">
                    Media
                  </span>
                ) : null}
                {exercise.youtubeUrl ? (
                  <span className="inline-flex h-auto rounded-sm border border-neutral-200/80 bg-neutral-100/85 px-2.5 py-1 text-[12px] font-normal text-neutral-600">
                    YT Link
                  </span>
                ) : null}
                {!exercise.mediaFileName && !exercise.youtubeUrl ? (
                  <span className="text-[13px] text-neutral-400">-</span>
                ) : null}
              </div>

              <div className="flex w-[8.5rem] justify-self-center self-center items-center justify-center gap-2">
                {isCustomExercise ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={exerciseRowActionButtonClassName}
                      onClick={() => onEditRow(exercise)}
                    >
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Edit exercise</span>
                    </Button>

                    <CoachWiseConfirmationDialog
                      title="Are you sure you want to delete this exercise?"
                      description={`${exercise.name} will be removed from the coach exercise library. This action can't be undone.`}
                      confirmLabel="Delete exercise"
                      variant="destructive"
                      onConfirm={() => onDeleteRow(exercise)}
                      trigger={
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={cn(
                            exerciseRowActionButtonClassName,
                            exerciseDeleteActionButtonClassName
                          )}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete exercise</span>
                        </Button>
                      }
                    />
                  </>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProgramiPageContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeTab =
    programTabs.find((tab) => tab.value === searchParams.get("tab"))?.value ?? "programs"

  const [programSearchQuery, setProgramSearchQuery] = React.useState("")
  const [templateSearchQuery, setTemplateSearchQuery] = React.useState("")
  const [exerciseSearchQuery, setExerciseSearchQuery] = React.useState("")
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = React.useState(false)
  const [editingExercise, setEditingExercise] =
    React.useState<ProgramBuilderExerciseLibraryItem | null>(null)

  const initialSeedPlans = React.useMemo<StoredProgramPlan[]>(
    () => createInitialStoredProgramPlans(),
    []
  )
  const programClientsByScope = React.useMemo(
    () =>
      new Map(
        clientData.map((client) => [
          String(client.id),
          {
            id: String(client.id),
            name: client.header,
            avatar: client.avatar,
          },
        ])
      ),
    []
  )
  const watchedStorageScopeIds = React.useMemo(
    () => [GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE, ...clientData.map((client) => String(client.id))],
    []
  )
  const initialRows = React.useMemo<ProgramPlansTableRow[]>(
    () =>
      initialSeedPlans.map((plan) => ({
        ...plan,
        storageScopeId: GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
      })),
    [initialSeedPlans]
  )
  const [rows, setRows] = React.useState<ProgramPlansTableRow[]>(initialRows)
  const [storedTemplates, setStoredTemplates] = React.useState<StoredProgramPlan[]>([])
  const [storedExercises, setStoredExercises] = React.useState<
    ProgramBuilderExerciseLibraryItem[]
  >([])

  React.useEffect(() => {
    const syncRows = () => {
      const globalRows = ensureStoredProgramPlans(
        GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
        initialSeedPlans
      ).map((plan) => ({
        ...plan,
        storageScopeId: GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
        clients: resolveProgramRowClients(plan, programClientsByScope),
      }))

      const clientScopedRows = clientData.flatMap((client) => {
        const storageScopeId = String(client.id)

        return readStoredProgramPlans(storageScopeId).map((plan) => ({
          ...plan,
          storageScopeId,
          clients: resolveProgramRowClients(
            plan,
            programClientsByScope,
            storageScopeId
          ),
        }))
      })

      setRows(
        [...globalRows, ...clientScopedRows].sort((left, right) =>
          right.createdAt.localeCompare(left.createdAt)
        )
      )
    }

    syncRows()

    const handleProgramsUpdated = (event: Event) => {
      const updatedStorageScopeId = (
        event as CustomEvent<{ storageScopeId?: string }>
      ).detail?.storageScopeId

      if (
        updatedStorageScopeId &&
        !watchedStorageScopeIds.includes(updatedStorageScopeId)
      ) {
        return
      }

      syncRows()
    }

    window.addEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    return () => {
      window.removeEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    }
  }, [initialRows, initialSeedPlans, programClientsByScope, watchedStorageScopeIds])

  React.useEffect(() => {
    const syncTemplates = () => {
      setStoredTemplates(readStoredProgramTemplates())
    }

    syncTemplates()
    window.addEventListener(PROGRAM_TEMPLATES_UPDATED_EVENT, syncTemplates)
    return () => {
      window.removeEventListener(PROGRAM_TEMPLATES_UPDATED_EVENT, syncTemplates)
    }
  }, [])

  React.useEffect(() => {
    const syncExercises = () => {
      setStoredExercises(readStoredProgramExercises())
    }

    syncExercises()
    window.addEventListener(PROGRAM_EXERCISES_UPDATED_EVENT, syncExercises)

    return () => {
      window.removeEventListener(PROGRAM_EXERCISES_UPDATED_EVENT, syncExercises)
    }
  }, [])

  const pushTab = React.useCallback(
    (nextTab: ProgramTab) => {
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.delete("storageScope")
      if (nextTab === "programs") {
        nextParams.delete("tab")
      } else {
        nextParams.set("tab", nextTab)
      }

      const queryString = nextParams.toString()
      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    },
    [pathname, router, searchParams]
  )

  const handleDuplicateRow = React.useCallback(
    (row: ProgramPlansTableRow) => {
      const nextTitle = buildNextDuplicatedProgramTitle(
        row.title,
        rows.map((entry) => entry.title)
      )
      const targetStorageScopeId =
        row.storageScopeId ?? GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE
      const duplicatedProgram = cloneStoredProgramPlan(row, {
        id:
          globalThis.crypto?.randomUUID?.() ??
          `program-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        title: nextTitle,
        createdAt: new Date().toISOString(),
        program: {
          ...row.program,
          id:
            globalThis.crypto?.randomUUID?.() ??
            `program-editor-${Date.now()}-${Math.round(Math.random() * 10000)}`,
          title: nextTitle,
        },
      })

      upsertStoredProgramPlan(targetStorageScopeId, duplicatedProgram)
      toast.success("Program duplicated", { description: `Created ${nextTitle}.` })
    },
    [rows]
  )

  const handleDeleteRow = React.useCallback((row: ProgramPlansTableRow) => {
    removeStoredProgramPlan(
      row.storageScopeId ?? GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
      row.id
    )
    toast.success("Program deleted", { description: `Removed ${row.title}.` })
  }, [])

  const handleDuplicateTemplateRow = React.useCallback(
    (row: ProgramPlansTableRow) => {
      const nextTitle = buildNextDuplicatedProgramTitle(
        row.title,
        [...storedTemplates.map((template) => template.title), ...programBuilderPresets.map((preset) => preset.title)]
      )

      if (isPresetTemplateRow(row)) {
        const presetId = row.id.replace(/^preset:/, "")
        const initialProgram = createProgramBuilderInitialProgram(
          getFixedPrograms(),
          presetId
        )
        const duplicatedTemplate = buildStoredProgramPlanFromBuilderState({
          title: nextTitle,
          description: initialProgram.description,
          days: createProgramBuilderInitialDays(initialProgram),
          myReps: PROGRAM_BUILDER_DEFAULT_REP_RANGES,
          myTempos: PROGRAM_BUILDER_DEFAULT_TEMPOS,
          showAdvancedSetOptions: false,
        })

        upsertStoredProgramTemplate(duplicatedTemplate)
        toast.success("Template duplicated", {
          description: `Created ${nextTitle}.`,
        })
        return
      }

      const duplicatedTemplate = cloneStoredProgramPlan(row, {
        id:
          globalThis.crypto?.randomUUID?.() ??
          `program-template-${Date.now()}-${Math.round(Math.random() * 10000)}`,
        title: nextTitle,
        createdAt: new Date().toISOString(),
        program: {
          ...row.program,
          id:
            globalThis.crypto?.randomUUID?.() ??
            `program-template-editor-${Date.now()}-${Math.round(Math.random() * 10000)}`,
          title: nextTitle,
        },
      })

      upsertStoredProgramTemplate(duplicatedTemplate)
      toast.success("Template duplicated", {
        description: `Created ${nextTitle}.`,
      })
    },
    [storedTemplates]
  )

  const handleDeleteTemplateRow = React.useCallback((row: ProgramPlansTableRow) => {
    removeStoredProgramTemplate(row.id)
    toast.success("Template deleted", {
      description: `Removed ${row.title}.`,
    })
  }, [])

  const filteredProgramRows = React.useMemo(() => {
    if (!programSearchQuery.trim()) {
      return rows
    }

    const normalizedQuery = programSearchQuery.toLowerCase()
    return rows.filter((row) => {
      const haystack = [
        row.title,
        row.description,
        ...row.workouts,
        ...(row.clients?.map((client) => client.name) ?? []),
      ]
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [programSearchQuery, rows])

  const filteredTemplateTableRows = React.useMemo<ProgramPlansTableRow[]>(() => {
    const normalizedQuery = templateSearchQuery.trim().toLowerCase()
    const matchesTemplateQuery = (values: string[]) =>
      !normalizedQuery || values.join(" ").toLowerCase().includes(normalizedQuery)

    const savedTemplateRows = storedTemplates
      .filter((template) =>
        matchesTemplateQuery([template.title, template.description, ...template.workouts])
      )
      .map((template) => ({
        ...template,
        description: formatProgramTemplateSummary(template.workouts),
      }))

    const presetTemplateRows = programBuilderPresets
      .filter((preset) =>
        matchesTemplateQuery([preset.title, preset.description, ...preset.workouts])
      )
      .map((preset, index) => ({
        id: `preset:${preset.id}`,
        title: preset.title,
        description: formatProgramPresetSummary(preset),
        workouts: [...preset.workouts],
        status: "Active" as const,
        createdAt: new Date(2026, 0, index + 1).toISOString(),
        program: {
          id: `template-${preset.id}`,
          title: preset.title,
          description: preset.description,
          workouts: [...preset.workouts],
          editorWorkouts: [],
        },
      }))

    return [...savedTemplateRows, ...presetTemplateRows]
  }, [storedTemplates, templateSearchQuery])

  const handleCreateExercise = React.useCallback(
    (
      input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
        instructions?: string | null
        equipment?: ProgramBuilderExerciseLibraryItem["equipment"]
        youtubeUrl?: string | null
        mediaFileName?: string | null
      }
    ) => {
      const nextExercise = editingExercise
        ? {
            ...editingExercise,
            name: input.name.trim(),
            muscle: input.muscle,
            type: input.type,
            instructions: input.instructions?.trim() || null,
            equipment: input.equipment?.length ? [...input.equipment] : null,
            youtubeUrl: input.youtubeUrl?.trim() || null,
            mediaFileName: input.mediaFileName ?? null,
          }
        : createProgramBuilderLibraryExercise(
            [...storedExercises, ...PROGRAM_BUILDER_EXERCISES],
            input
          )

      upsertStoredProgramExercise(nextExercise)
      setEditingExercise(null)
      toast.success(editingExercise ? "Exercise updated" : "Exercise saved", {
        description: editingExercise
          ? `${nextExercise.name} was updated in the coach exercise library.`
          : `${nextExercise.name} is now available in the exercise library.`,
      })
    },
    [editingExercise, storedExercises]
  )

  const filteredExerciseRows = React.useMemo(() => {
    if (!exerciseSearchQuery.trim()) {
      return storedExercises
    }

    const normalizedQuery = exerciseSearchQuery.toLowerCase()
    return [...storedExercises, ...PROGRAM_BUILDER_EXERCISES].filter((exercise) =>
      [exercise.name, exercise.muscle, formatExerciseTypeLabel(exercise.type)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [exerciseSearchQuery, storedExercises])

  const handleEditExerciseRow = React.useCallback(
    (exercise: ProgramBuilderExerciseLibraryItem) => {
      setEditingExercise(exercise)
      setIsCreateExerciseOpen(true)
    },
    []
  )

  const handleDeleteExerciseRow = React.useCallback(
    (exercise: ProgramBuilderExerciseLibraryItem) => {
      removeStoredProgramExercise(exercise.id)
      toast.success("Exercise deleted", {
        description: `${exercise.name} was removed from the coach exercise library.`,
      })
    },
    []
  )

  const programsBackHref = `${pathname}?tab=programs`
  const templatesBackHref = `${pathname}?tab=templates`

  return (
    <section className="min-w-0 bg-neutral-50">
      <ProgramBuilderCreateExerciseDialog
        open={isCreateExerciseOpen}
        onOpenChange={(open) => {
          setIsCreateExerciseOpen(open)
          if (!open) {
            setEditingExercise(null)
          }
        }}
        initialName={exerciseSearchQuery.trim()}
        initialExercise={editingExercise}
        submitLabel={editingExercise ? "Save Exercise" : "Add Exercise"}
        onCreate={handleCreateExercise}
      />

      <Tabs value={activeTab} onValueChange={(value) => pushTab(value as ProgramTab)} className="w-full gap-0">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 pr-4 pl-0">
            <div className="min-w-0 flex-1 overflow-x-auto">
              <TabsList
                variant="line"
                className="w-max min-w-full justify-start gap-0 rounded-none bg-transparent p-0"
              >
                {programTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={profileTabTriggerClassName}
                  >
                    <tab.icon className="size-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {activeTab === "exercises" ? (
              <PrimaryActionButton
                label="Exercise"
                icon={IconPlus}
                onClick={() => {
                  setEditingExercise(null)
                  setIsCreateExerciseOpen(true)
                }}
              />
            ) : (
              <PrimaryActionButton
                label={activeTab === "templates" ? "Template" : "Program"}
                icon={IconPlus}
                href={getProgramsCreateHref(
                  activeTab === "templates" ? templatesBackHref : programsBackHref
                )}
              />
            )}
          </div>
        </div>

        <TabsContent value="programs" className="mt-0 bg-neutral-50 px-4 py-4">
          <div className="space-y-4">
            <ToolbarSearchInput
              value={programSearchQuery}
              onValueChange={setProgramSearchQuery}
              placeholder="Search programs"
              wrapperClassName="max-w-[17rem]"
              className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />

            <ProgramPlansTable
              rows={filteredProgramRows}
              showClientColumn
              getDetailRowHref={(row) =>
                getProgramsDetailHref(
                  row.id,
                  buildProgramsBackHrefWithStorageScope(
                    programsBackHref,
                    row.storageScopeId
                  )
                )
              }
              getEditRowHref={(row) =>
                getProgramsEditHref(
                  row.id,
                  buildProgramsBackHrefWithStorageScope(
                    programsBackHref,
                    row.storageScopeId
                  )
                )
              }
              onDuplicateRow={handleDuplicateRow}
              onDeleteRow={handleDeleteRow}
            />
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-0 bg-neutral-50 px-4 py-4">
          <div className="space-y-4">
            <ToolbarSearchInput
              value={templateSearchQuery}
              onValueChange={setTemplateSearchQuery}
              placeholder="Search templates"
              wrapperClassName="max-w-[17rem]"
              className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />

            <ProgramPlansTable
              rows={filteredTemplateTableRows}
              emptyMessage="No templates found."
              firstColumnLabel="Program template"
              getDetailRowHref={(row) =>
                row.id.startsWith("preset:")
                  ? getProgramsCreateHref(templatesBackHref, row.id.replace(/^preset:/, ""))
                  : getProgramsCreateHref(templatesBackHref, undefined, row.id)
              }
              getEditRowHref={(row) =>
                row.id.startsWith("preset:")
                  ? getProgramsCreateHref(templatesBackHref, row.id.replace(/^preset:/, ""))
                  : getProgramsCreateHref(templatesBackHref, undefined, row.id)
              }
              onDuplicateRow={handleDuplicateTemplateRow}
              onDeleteRow={handleDeleteTemplateRow}
              canDeleteRow={(row) => !isPresetTemplateRow(row)}
            />
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-0 bg-neutral-50 px-4 py-4">
          <div className="space-y-4">
            <ToolbarSearchInput
              value={exerciseSearchQuery}
              onValueChange={setExerciseSearchQuery}
              placeholder="Search exercises"
              wrapperClassName="max-w-[17rem]"
              className="h-9 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
            />

            <ProgramsExercisesTable
              rows={filteredExerciseRows}
              onEditRow={handleEditExerciseRow}
              onDeleteRow={handleDeleteExerciseRow}
            />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  )
}

export default function ProgramiPage() {
  return (
    <React.Suspense fallback={<section className="min-w-0 bg-neutral-50" />}>
      <ProgramiPageContent />
    </React.Suspense>
  )
}
