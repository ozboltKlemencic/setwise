import type {
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
      editorWorkouts: [],
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

  const presetEditorWorkouts = sampleProgram.editorWorkouts.map((workout, index) => {
    const label = preset.workouts[index] ?? workout.label

    return {
      ...workout,
      id:
        globalThis.crypto?.randomUUID?.() ??
        `program-preset-workout-${preset.id}-${index}-${Date.now()}`,
      label,
      intro: `Build out the ${label.toLowerCase()} session with your preferred exercises, sets, and notes.`,
      sections: workout.sections.map((section) => ({
        ...section,
        exercises: section.exercises.map((exercise) => ({
          ...exercise,
          fields: [...exercise.fields],
          values: [...exercise.values],
        })),
      })),
    }
  })

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

export function isProgramBuilderPresetId(value?: string | null): value is ProgramBuilderPresetId {
  return Boolean(getProgramBuilderPreset(value))
}
