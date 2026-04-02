export type FixedProgramBuilderExercise = {
  id: string
  name: string
  note: string
  fields: string[]
  values: string[]
}

export type FixedProgramBuilderSection = {
  id: string
  title: string
  note: string
  tone?: "dark" | "light"
  exercises: FixedProgramBuilderExercise[]
}

export type FixedProgramBuilderWorkout = {
  id: string
  label: string
  intro: string
  sections: FixedProgramBuilderSection[]
}

export type FixedProgramEditorProgram = {
  id: string
  title: string
  description: string
  workouts: string[]
  editorWorkouts: FixedProgramBuilderWorkout[]
}

export type ProgramBuilderPreset = {
  id: string
  title: string
  description: string
  workouts: string[]
}

export type ProgramBuilderPresetId = ProgramBuilderPreset["id"]
