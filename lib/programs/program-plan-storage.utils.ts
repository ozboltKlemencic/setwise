import {
  cloneProgramBuilderDay,
  formatProgramBuilderRepRange,
  formatProgramBuilderTempo,
} from "@/lib/programs/program-builder-data"
import { getFixedPrograms } from "@/lib/programs/fixed-programs-data"
import type {
  FixedProgramBuilderExercise,
  FixedProgramBuilderSection,
  FixedProgramBuilderWorkout,
  FixedProgramEditorProgram,
  ProgramBuilderDay,
  StoredProgramBuilderSnapshot,
  StoredProgramPlan,
} from "@/types"

function createProgramStorageId(prefix: string) {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.round(Math.random() * 10000)}`
}

function cloneEditorExercise(
  exercise: FixedProgramBuilderExercise
): FixedProgramBuilderExercise {
  return {
    ...exercise,
    fields: [...exercise.fields],
    values: [...exercise.values],
  }
}

function cloneEditorSection(
  section: FixedProgramBuilderSection
): FixedProgramBuilderSection {
  return {
    ...section,
    exercises: section.exercises.map(cloneEditorExercise),
  }
}

function cloneEditorWorkout(
  workout: FixedProgramBuilderWorkout
): FixedProgramBuilderWorkout {
  return {
    ...workout,
    sections: workout.sections.map(cloneEditorSection),
  }
}

function cloneEditorProgram(program: FixedProgramEditorProgram): FixedProgramEditorProgram {
  return {
    ...program,
    workouts: [...program.workouts],
    editorWorkouts: program.editorWorkouts.map(cloneEditorWorkout),
  }
}

export function cloneStoredProgramBuilderSnapshot(
  snapshot: StoredProgramBuilderSnapshot
): StoredProgramBuilderSnapshot {
  return {
    description: snapshot.description,
    days: snapshot.days.map(cloneProgramBuilderDay),
    myReps: [...snapshot.myReps],
    myTempos: [...snapshot.myTempos],
    showAdvancedSetOptions: snapshot.showAdvancedSetOptions,
    assignedClientIds: snapshot.assignedClientIds
      ? [...snapshot.assignedClientIds]
      : undefined,
  }
}

export function buildProgramBuilderInitialProgramFromStoredPlan(
  plan: StoredProgramPlan
): FixedProgramEditorProgram {
  const clonedProgram = cloneEditorProgram(plan.program)

  return {
    ...clonedProgram,
    id: plan.id,
    title: plan.title,
    description: plan.description,
    workouts: [...plan.workouts],
  }
}

function buildExerciseSummaryNote(day: ProgramBuilderDay, sets: number) {
  return `${day.name} · ${sets} set${sets === 1 ? "" : "s"}`
}

function buildExerciseSummaryValues(day: ProgramBuilderDay) {
  return day.exercises.length
}

function formatDistinctValues(values: Array<string | number | null | undefined>) {
  const distinctValues = Array.from(
    new Set(values.filter((value): value is string | number => value !== null && value !== undefined && `${value}`.trim().length > 0))
  )

  return distinctValues.length ? distinctValues.join(", ") : "-"
}

function buildEditorExercise(
  day: ProgramBuilderDay,
  exercise: ProgramBuilderDay["exercises"][number]
): FixedProgramBuilderExercise {
  return {
    id: createProgramStorageId("program-editor-exercise"),
    name: exercise.name,
    note: buildExerciseSummaryNote(day, exercise.sets.length),
    fields: ["Sets", "Range", "Tempo", "RPE", "RIR"],
    values: [
      String(exercise.sets.length),
      formatDistinctValues(exercise.sets.map(formatProgramBuilderRepRange)),
      formatDistinctValues(
        exercise.sets.map((set) => (set.tempo ? formatProgramBuilderTempo(set.tempo) : null))
      ),
      formatDistinctValues(exercise.sets.map((set) => set.rpe)),
      formatDistinctValues(exercise.sets.map((set) => set.rir)),
    ],
  }
}

function buildEditorWorkout(day: ProgramBuilderDay): FixedProgramBuilderWorkout {
  return {
    id: createProgramStorageId("program-editor-workout"),
    label: day.name,
    intro: day.isRest
      ? "Recovery day with no scheduled training exercises."
      : `Structured session with ${buildExerciseSummaryValues(day)} exercise${day.exercises.length === 1 ? "" : "s"}.`,
    sections: [
      {
        id: createProgramStorageId("program-editor-section"),
        title: day.isRest ? "Recovery" : "Exercises",
        note: day.isRest
          ? "Use this day for recovery, mobility, or light cardio."
          : "Saved from the program builder.",
        tone: "light",
        exercises: day.exercises.map((exercise) => buildEditorExercise(day, exercise)),
      },
    ],
  }
}

function buildEditorProgramFromSnapshot(
  title: string,
  description: string,
  days: ProgramBuilderDay[]
): FixedProgramEditorProgram {
  const editorWorkouts = days.map(buildEditorWorkout)

  return {
    id: createProgramStorageId("program-editor"),
    title,
    description,
    workouts: days.filter((day) => !day.isRest).map((day) => day.name),
    editorWorkouts,
  }
}

export function buildStoredProgramPlanFromBuilderState({
  planId,
  title,
  description,
  days,
  myReps,
  myTempos,
  showAdvancedSetOptions,
  assignedClientIds,
  createdAt,
}: {
  planId?: string
  title: string
  description: string
  days: ProgramBuilderDay[]
  myReps: string[]
  myTempos: string[]
  showAdvancedSetOptions: boolean
  assignedClientIds?: string[]
  createdAt?: string
}): StoredProgramPlan {
  const resolvedTitle = title.trim() || "New Program"
  const resolvedDescription =
    description.trim() || "Build a fixed training program from scratch."
  const builderSnapshot: StoredProgramBuilderSnapshot = {
    description: resolvedDescription,
    days: days.map(cloneProgramBuilderDay),
    myReps: [...myReps],
    myTempos: [...myTempos],
    showAdvancedSetOptions,
    assignedClientIds:
      assignedClientIds?.length
        ? Array.from(new Set(assignedClientIds))
        : undefined,
  }
  const workouts = days.filter((day) => !day.isRest).map((day) => day.name)

  return {
    id: planId ?? createProgramStorageId("stored-program"),
    title: resolvedTitle,
    description: resolvedDescription,
    workouts,
    status: days.some(
      (day) => !day.isRest && day.exercises.length > 0
    )
      ? "Active"
      : "Disabled",
    createdAt: createdAt ?? new Date().toISOString(),
    assignedClientIds:
      assignedClientIds?.length
        ? Array.from(new Set(assignedClientIds))
        : undefined,
    program: buildEditorProgramFromSnapshot(
      resolvedTitle,
      resolvedDescription,
      builderSnapshot.days
    ),
    builderSnapshot,
  }
}

export function cloneStoredProgramPlan(
  plan: StoredProgramPlan,
  overrides?: Partial<StoredProgramPlan>
): StoredProgramPlan {
  return {
    ...plan,
    ...overrides,
    workouts: [...(overrides?.workouts ?? plan.workouts)],
    program: cloneEditorProgram(overrides?.program ?? plan.program),
    builderSnapshot: overrides?.builderSnapshot
      ? cloneStoredProgramBuilderSnapshot(overrides.builderSnapshot)
      : plan.builderSnapshot
        ? cloneStoredProgramBuilderSnapshot(plan.builderSnapshot)
        : undefined,
  }
}

export function createInitialStoredProgramPlans() {
  return getFixedPrograms().map((program, index) => ({
    id: program.id,
    title: program.title,
    description: program.description,
    workouts: [...program.workouts],
    status: program.workouts.length > 0 ? "Active" : "Disabled",
    createdAt: new Date(Date.now() - index * 1000).toISOString(),
    program: cloneEditorProgram(program),
  })) satisfies StoredProgramPlan[]
}
