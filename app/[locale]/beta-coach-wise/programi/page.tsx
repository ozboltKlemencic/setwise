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

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { ProgramPresetCard } from "@/components/coachWise/clients/programs/program-preset-card"
import {
  ProgramPlansTable,
  type ProgramPlansTableRow,
} from "@/components/coachWise/tables/program-plans-table"
import { ToolbarSearchInput } from "@/components/coachWise/toolbar-search-input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ensureStoredProgramPlans,
  GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE,
  PROGRAM_PLANS_UPDATED_EVENT,
  readStoredProgramPlans,
  removeStoredProgramPlan,
  upsertStoredProgramPlan,
} from "@/lib/handlers/program-plan-storage"
import {
  getProgramsCreateHref,
  getProgramsDetailHref,
  getProgramsEditHref,
} from "@/lib/handlers/programs.handlers"
import {
  PROGRAM_BUILDER_EXERCISES,
} from "@/lib/programs/program-builder-data"
import {
  cloneStoredProgramPlan,
  createInitialStoredProgramPlans,
} from "@/lib/programs/program-plan-storage.utils"
import {
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

function ProgramsExercisesTable({
  rows,
}: {
  rows: ProgramBuilderExerciseLibraryItem[]
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
      <Table>
        <TableHeader className="bg-neutral-50">
          <TableRow className="hover:bg-neutral-50">
            <TableHead className="h-auto px-5 py-3 text-[13px] font-medium text-neutral-900">
              Exercise
            </TableHead>
            <TableHead className="h-auto px-5 py-3 text-[13px] font-medium text-neutral-900">
              Primary Muscle
            </TableHead>
            <TableHead className="h-auto px-5 py-3 text-[13px] font-medium text-neutral-900">
              Type
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((exercise) => (
            <TableRow key={exercise.id} className="hover:bg-neutral-50">
              <TableCell className="px-5 py-3.5 text-[15px] font-medium text-neutral-950">
                {exercise.name}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-[14px] text-neutral-600">
                {exercise.muscle}
              </TableCell>
              <TableCell className="px-5 py-3.5 text-[14px] text-neutral-600">
                {formatExerciseTypeLabel(exercise.type)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

  const initialRows = React.useMemo<StoredProgramPlan[]>(
    () => createInitialStoredProgramPlans(),
    []
  )
  const [rows, setRows] = React.useState<StoredProgramPlan[]>(initialRows)

  React.useEffect(() => {
    const syncRows = () => {
      setRows(
        ensureStoredProgramPlans(GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE, initialRows)
      )
    }

    syncRows()

    const handleProgramsUpdated = (event: Event) => {
      const updatedStorageScopeId = (
        event as CustomEvent<{ storageScopeId?: string }>
      ).detail?.storageScopeId

      if (updatedStorageScopeId !== GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE) {
        return
      }

      setRows(readStoredProgramPlans(GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE))
    }

    window.addEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    return () => {
      window.removeEventListener(PROGRAM_PLANS_UPDATED_EVENT, handleProgramsUpdated)
    }
  }, [initialRows])

  const pushTab = React.useCallback(
    (nextTab: ProgramTab) => {
      const nextParams = new URLSearchParams(searchParams.toString())
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

      upsertStoredProgramPlan(GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE, duplicatedProgram)
      toast.success("Program duplicated", { description: `Created ${nextTitle}.` })
    },
    [rows]
  )

  const handleDeleteRow = React.useCallback((row: ProgramPlansTableRow) => {
    removeStoredProgramPlan(GLOBAL_PROGRAM_PLANS_STORAGE_SCOPE, row.id)
    toast.success("Program deleted", { description: `Removed ${row.title}.` })
  }, [])

  const filteredProgramRows = React.useMemo(() => {
    if (!programSearchQuery.trim()) {
      return rows
    }

    const normalizedQuery = programSearchQuery.toLowerCase()
    return rows.filter((row) => {
      const haystack = [row.title, row.description, ...row.workouts]
        .join(" ")
        .toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [programSearchQuery, rows])

  const filteredPresetRows = React.useMemo(() => {
    if (!templateSearchQuery.trim()) {
      return programBuilderPresets
    }

    const normalizedQuery = templateSearchQuery.toLowerCase()
    return programBuilderPresets.filter((preset) =>
      [preset.title, preset.description, ...preset.workouts]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [templateSearchQuery])

  const filteredExerciseRows = React.useMemo(() => {
    if (!exerciseSearchQuery.trim()) {
      return PROGRAM_BUILDER_EXERCISES
    }

    const normalizedQuery = exerciseSearchQuery.toLowerCase()
    return PROGRAM_BUILDER_EXERCISES.filter((exercise) =>
      [exercise.name, exercise.muscle, formatExerciseTypeLabel(exercise.type)]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    )
  }, [exerciseSearchQuery])

  const programsBackHref = `${pathname}?tab=programs`
  const templatesBackHref = `${pathname}?tab=templates`

  return (
    <section className="min-w-0 bg-neutral-50">
      <Tabs value={activeTab} onValueChange={(value) => pushTab(value as ProgramTab)} className="w-full gap-0">
        <div className="border-b border-neutral-200 bg-neutral-50">
          <div className="flex min-w-0 items-center justify-between gap-4 px-4">
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

            <PrimaryActionButton
              label="Program"
              icon={IconPlus}
              href={getProgramsCreateHref(
                activeTab === "templates" ? templatesBackHref : programsBackHref
              )}
            />
          </div>
        </div>

        <TabsContent value="programs" className="mt-0 bg-neutral-50 px-4 py-4">
          <div className="space-y-4">
            <ToolbarSearchInput
              value={programSearchQuery}
              onValueChange={setProgramSearchQuery}
              placeholder="Search programs"
              wrapperClassName="max-w-sm"
              className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-200 focus-visible:ring-0"
            />

            <ProgramPlansTable
              rows={filteredProgramRows}
              getDetailRowHref={(row) => getProgramsDetailHref(row.id, programsBackHref)}
              getEditRowHref={(row) => getProgramsEditHref(row.id, programsBackHref)}
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
              wrapperClassName="max-w-sm"
              className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-200 focus-visible:ring-0"
            />

            {filteredPresetRows.length ? (
              <div className="flex flex-wrap gap-3">
                {filteredPresetRows.map((preset) => (
                  <ProgramPresetCard
                    key={preset.id}
                    href={getProgramsCreateHref(templatesBackHref, preset.id)}
                    title={preset.title}
                    description={formatProgramPresetSummary(preset)}
                    className="md:w-[14.5rem]"
                  />
                ))}
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white px-5 py-10 text-center text-[14px] text-neutral-500">
                No templates found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-0 bg-neutral-50 px-4 py-4">
          <div className="space-y-4">
            <ToolbarSearchInput
              value={exerciseSearchQuery}
              onValueChange={setExerciseSearchQuery}
              placeholder="Search exercises"
              wrapperClassName="max-w-sm"
              className="h-10 rounded-sm border-neutral-200 bg-white shadow-none focus-visible:border-neutral-200 focus-visible:ring-0"
            />

            <ProgramsExercisesTable rows={filteredExerciseRows} />
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
