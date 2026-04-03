import {
  PROGRAM_BUILDER_EXERCISES,
  PROGRAM_BUILDER_SMART_DEFAULTS,
  formatProgramBuilderRepRange,
} from "@/lib/programs/program-builder-data"
import type {
  FixedProgramBuilderExercise,
  FixedProgramBuilderSection,
  FixedProgramBuilderWorkout,
  FixedProgramEditorProgram,
  ProgramBuilderPreset,
  ProgramBuilderPresetId,
} from "@/types"

export const programBuilderPresets: ProgramBuilderPreset[] = [
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

export function getProgramBuilderPreset(
  presetId?: string | null
): ProgramBuilderPreset | undefined {
  if (!presetId) {
    return undefined
  }

  return programBuilderPresets.find((preset) => preset.id === presetId)
}

function formatProgramPresetWorkoutLabel(workout: string) {
  return workout
    .replace(/\b1\b/g, "A")
    .replace(/\b2\b/g, "B")
    .replace(/\b3\b/g, "C")
    .replace(/\b4\b/g, "D")
}

export function formatProgramPresetSummary(preset: ProgramBuilderPreset) {
  const dayLabel = preset.workouts.length === 1 ? "dan" : "dni"
  const workoutsLabel = preset.workouts
    .map(formatProgramPresetWorkoutLabel)
    .join(", ")

  return `${preset.workouts.length} ${dayLabel} · ${workoutsLabel}`
}

function createProgramBuilderUtilityId(prefix: string, seed: string) {
  const safeSeed = seed.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  return `${prefix}-${safeSeed}-${Math.random().toString(36).slice(2, 7)}`
}

function getPresetExerciseIdsForWorkoutLabel(label: string) {
  const normalizedLabel = label.toLowerCase()

  if (normalizedLabel.includes("upper")) {
    return [1, 14, 20, 16, 25]
  }

  if (
    normalizedLabel.includes("lower") ||
    normalizedLabel.includes("legs") ||
    normalizedLabel.includes("leg") ||
    normalizedLabel.includes("glute")
  ) {
    return [6, 7, 11, 9, 13]
  }

  if (normalizedLabel.includes("push") || normalizedLabel.includes("chest")) {
    return [1, 2, 20, 21, 26]
  }

  if (normalizedLabel.includes("pull") || normalizedLabel.includes("back")) {
    return [14, 16, 17, 22, 25]
  }

  if (normalizedLabel.includes("shoulder")) {
    return [20, 21, 22, 23, 24]
  }

  if (normalizedLabel.includes("arm")) {
    return [25, 26, 27, 28, 29]
  }

  if (normalizedLabel.includes("core")) {
    return [31, 32, 21, 22]
  }

  return [6, 1, 14, 20, 9]
}

function buildPresetEditorExercise(exerciseId: number): FixedProgramBuilderExercise | null {
  const exercise = PROGRAM_BUILDER_EXERCISES.find((entry) => entry.id === exerciseId)

  if (!exercise) {
    return null
  }

  const defaultSets = PROGRAM_BUILDER_SMART_DEFAULTS[exercise.type]

  return {
    id: createProgramBuilderUtilityId(
      "program-preset-exercise",
      `${exercise.id}-${exercise.name}`
    ),
    name: exercise.name,
    note:
      exercise.instructions?.trim() ||
      `Focus on controlled reps and consistent setup for ${exercise.muscle.toLowerCase()} work.`,
    fields: ["Sets", "Range", "Tempo", "RPE", "RIR"],
    values: [
      String(defaultSets.length),
      formatProgramBuilderRepRange(defaultSets[0]),
      "-",
      "-",
      "-",
    ],
  }
}

function buildPresetEditorSection(label: string): FixedProgramBuilderSection {
  return {
    id: createProgramBuilderUtilityId("program-preset-section", label),
    title: "Exercises",
    note: `Starter exercise block for ${label.toLowerCase()}.`,
    tone: "light",
    exercises: getPresetExerciseIdsForWorkoutLabel(label)
      .map(buildPresetEditorExercise)
      .filter((exercise): exercise is FixedProgramBuilderExercise => Boolean(exercise)),
  }
}

function buildPresetEditorWorkout(label: string): FixedProgramBuilderWorkout {
  return {
    id: createProgramBuilderUtilityId("program-preset-workout", label),
    label,
    intro: `Build out the ${label.toLowerCase()} session with your preferred exercises, sets, and notes.`,
    sections: [buildPresetEditorSection(label)],
  }
}

export function createProgramBuilderInitialProgram(
  basePrograms: FixedProgramEditorProgram[],
  presetId?: string | null
): FixedProgramEditorProgram {
  const sampleProgram =
    basePrograms.find((program) => program.workouts.length > 0) ?? basePrograms[0]
  const preset = getProgramBuilderPreset(presetId)

  if (!sampleProgram) {
    return {
      id: `program-builder-${Date.now()}`,
      title: preset?.title ?? "New Program",
      description:
        preset?.description ?? "Build a fixed training program from scratch.",
      workouts: preset?.workouts ?? [],
      editorWorkouts: preset ? preset.workouts.map(buildPresetEditorWorkout) : [],
    }
  }

  if (!preset) {
    return {
      ...sampleProgram,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `program-builder-${Date.now()}-${Math.round(Math.random() * 10000)}`,
      title: "New Program",
      description: "Build a fixed training program from scratch.",
      workouts: [],
      editorWorkouts: [],
    }
  }

  return {
    ...sampleProgram,
    id:
      globalThis.crypto?.randomUUID?.() ??
      `program-preset-${preset.id}-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    title: preset.title,
    description: preset.description,
    workouts: [...preset.workouts],
    editorWorkouts: preset.workouts.map(buildPresetEditorWorkout),
  }
}

export function isProgramBuilderPresetId(
  value?: string | null
): value is ProgramBuilderPresetId {
  return Boolean(getProgramBuilderPreset(value))
}
