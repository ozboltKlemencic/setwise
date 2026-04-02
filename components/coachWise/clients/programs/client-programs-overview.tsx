"use client"

import * as React from "react"
import { Dumbbell } from "lucide-react"
import { toast } from "sonner"

import { ClientQuickActionCard } from "@/components/coachWise/clients/info/client-quick-action-card"
import { NutritionSectionTitle } from "@/components/coachWise/clients/nutrition/panel/components"
import {
  ProgramPresetCard,
  type ProgramPresetCardData,
} from "@/components/coachWise/clients/programs/program-preset-card"
import {
  AddProgramDialog,
  FixedProgramEditorDialog,
  type FixedProgramEditorProgram,
  getFixedPrograms,
} from "@/components/coachWise/programs/exercise-history-panel"
import {
  ProgramPlansTable,
  type ProgramPlanStatus,
  type ProgramPlansTableRow,
} from "@/components/coachWise/tables/program-plans-table"

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

const PROGRAM_PRESET_CARDS: ProgramPresetCardData[] = [
  {
    id: "upper-lower",
    title: "Upper / Lower",
    description: "A simple 4-day split alternating upper and lower body sessions.",
    workouts: ["Upper 1", "Lower 1", "Upper 2", "Lower 2"],
  },
  {
    id: "bro-split",
    title: "Bro Split",
    description: "A classic 5-day bodybuilding split with one main focus per day.",
    workouts: ["Chest", "Back", "Shoulders", "Arms", "Legs"],
  },
  {
    id: "push-pull-legs",
    title: "Push Pull Legs",
    description: "Balanced strength and hypertrophy setup with clear movement patterns.",
    workouts: ["Push", "Pull", "Legs", "Push 2", "Pull 2"],
  },
  {
    id: "full-body",
    title: "Full Body",
    description: "A flexible full-body structure for beginners and busy schedules.",
    workouts: ["Workout A", "Workout B", "Workout C"],
  },
  {
    id: "glute-lower",
    title: "Glute / Lower Focus",
    description: "Lower-body focused template with extra volume for glutes and legs.",
    workouts: ["Glutes", "Lower Body", "Upper Support", "Glutes 2"],
  },
]

function buildPresetProgram(
  preset: ProgramPresetCardData,
  sampleProgram: FixedProgramEditorProgram
): FixedProgramEditorProgram {
  const presetEditorWorkouts =
    sampleProgram.editorWorkouts.length > 0
      ? preset.workouts.map((label, index) => {
          const sourceWorkout =
            sampleProgram.editorWorkouts[index % sampleProgram.editorWorkouts.length]

          return {
            ...sourceWorkout,
            id:
              globalThis.crypto?.randomUUID?.() ??
              `program-preset-workout-${preset.id}-${index}-${Date.now()}`,
            label,
            intro: `Build out the ${label.toLowerCase()} session with your preferred exercises, sets, and notes.`,
            sections: sourceWorkout.sections.map((section) => ({
              ...section,
              exercises: section.exercises.map((exercise) => ({
                ...exercise,
                fields: [...exercise.fields],
                values: [...exercise.values],
              })),
            })),
          }
        })
      : []

  return {
    ...sampleProgram,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `program-preset-${preset.id}-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    title: preset.title,
    description: preset.description,
    workouts: [...preset.workouts],
    editorWorkouts: presetEditorWorkouts,
  }
}

function ClientProgramsOverviewComponent() {
  const basePrograms = React.useMemo(() => getFixedPrograms(), [])
  const sampleProgram = React.useMemo(
    () => basePrograms.find((program) => program.workouts.length > 0) ?? basePrograms[0],
    [basePrograms]
  )

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
          <AddProgramDialog
            trigger={
              <ClientQuickActionCard
                sectionLabel="Programs"
                title="New Program"
                description="Build a fixed training program from scratch or start from a template."
                icon={<Dumbbell className="size-4" />}
                tone="programs"
                size="compact"
                className="md:w-[21rem]"
              />
            }
          />
        </div>

        <div className="mt-5">
          <NutritionSectionTitle title="Presets" />
          <div className="flex flex-wrap gap-3">
            {PROGRAM_PRESET_CARDS.map((preset) => (
              <FixedProgramEditorDialog
                key={preset.id}
                program={buildPresetProgram(preset, sampleProgram)}
                trigger={
                  <ProgramPresetCard
                    title={preset.title}
                    description={preset.description}
                    className="md:w-[15.5rem]"
                  />
                }
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
