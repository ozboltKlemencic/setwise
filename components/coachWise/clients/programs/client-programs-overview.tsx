"use client"

import * as React from "react"
import { Dumbbell } from "lucide-react"
import { toast } from "sonner"

import { ClientQuickActionCard } from "@/components/coachWise/clients/info/client-quick-action-card"
import { NutritionSectionTitle } from "@/components/coachWise/clients/nutrition/panel/components"
import {
  ProgramPresetCard,
} from "@/components/coachWise/clients/programs/program-preset-card"
import {
  ProgramPlansTable,
  type ProgramPlanStatus,
  type ProgramPlansTableRow,
} from "@/components/coachWise/tables/program-plans-table"
import { getClientProgramBuilderHref } from "@/lib/handlers/programs.handlers"
import { getFixedPrograms } from "@/lib/programs/fixed-programs-data"
import { programBuilderPresets } from "@/lib/programs/program-builder.utils"

function cloneProgramRow(row: ProgramPlansTableRow, title: string): ProgramPlansTableRow {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `program-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    title,
    description: row.description,
    workouts: [...row.workouts],
    status: row.status,
    program: {
      ...row.program,
      id: globalThis.crypto?.randomUUID?.() ?? `program-editor-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      title,
      workouts: [...row.program.workouts],
      editorWorkouts: row.program.editorWorkouts.map((workout) => ({
        ...workout,
        sections: workout.sections.map((section) => ({
          ...section,
          exercises: section.exercises.map((exercise) => ({
            ...exercise,
            fields: [...exercise.fields],
            values: [...exercise.values],
          })),
        })),
      })),
    },
  }
}

function buildNextDuplicatedProgramTitle(title: string, existingTitles: string[]) {
  let nextIndex = 1
  let nextTitle = `${title} - copy ${nextIndex}`

  while (existingTitles.includes(nextTitle)) {
    nextIndex += 1
    nextTitle = `${title} - copy ${nextIndex}`
  }

  return nextTitle
}

function deriveProgramStatus(
  program: ReturnType<typeof getFixedPrograms>[number],
): ProgramPlanStatus {
  return program.workouts.length > 0 ? "Active" : "Disabled"
}

type ClientProgramsOverviewProps = {
  clientBasePath: string
}

function ClientProgramsOverviewComponent({
  clientBasePath,
}: ClientProgramsOverviewProps) {
  const basePrograms = React.useMemo(() => getFixedPrograms(), [])
  const overviewHref = `${clientBasePath}/programs?programTab=calendar`

  const initialRows = React.useMemo<ProgramPlansTableRow[]>(
    () =>
      basePrograms.map((program) => ({
        id: program.id,
        title: program.title,
        description: program.description,
        workouts: program.workouts,
        status: deriveProgramStatus(program),
        program,
      })),
    [basePrograms]
  )
  const [rows, setRows] = React.useState<ProgramPlansTableRow[]>(initialRows)

  const handleDuplicateRow = React.useCallback((row: ProgramPlansTableRow) => {
    const nextTitle = buildNextDuplicatedProgramTitle(
      row.title,
      rows.map((entry) => entry.title)
    )
    setRows((currentRows) => [cloneProgramRow(row, nextTitle), ...currentRows])
    toast.success("Program duplicated", { description: `Created ${nextTitle}.` })
  }, [rows])

  const handleDeleteRow = React.useCallback((row: ProgramPlansTableRow) => {
    setRows((currentRows) => currentRows.filter((entry) => entry.id !== row.id))
    toast.success("Program deleted", { description: `Removed ${row.title}.` })
  }, [])

  return (
    <div className="bg-neutral-50 px-4 py-4">
      <div className="mb-5">
        <NutritionSectionTitle title="Create programs" />
        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-stretch">
          <ClientQuickActionCard
            href={getClientProgramBuilderHref(clientBasePath, {
              backTo: overviewHref,
            })}
            sectionLabel="Programs"
            title="New Program"
            description="Build a fixed training program from scratch or start from a template."
            icon={<Dumbbell className="size-4" />}
            tone="programs"
            size="compact"
            className="md:w-[21rem]"
          />
        </div>

        <div className="mt-5">
          <NutritionSectionTitle title="Presets" />
          <div className="flex flex-wrap gap-3">
            {programBuilderPresets.map((preset) => (
              <ProgramPresetCard
                key={preset.id}
                href={getClientProgramBuilderHref(clientBasePath, {
                  backTo: overviewHref,
                  presetId: preset.id,
                })}
                title={preset.title}
                description={preset.description}
                className="md:w-[15.5rem]"
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <NutritionSectionTitle title="Existing programs" />
        <ProgramPlansTable
          rows={rows}
          onDuplicateRow={handleDuplicateRow}
          onDeleteRow={handleDeleteRow}
        />
      </div>
    </div>
  )
}

export const ClientProgramsOverview = React.memo(ClientProgramsOverviewComponent)
