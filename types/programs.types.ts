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

export type ProgramBuilderExerciseType =
  | "compound_heavy"
  | "compound_medium"
  | "isolation"

export type ProgramBuilderMuscle =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"

export type ProgramBuilderMuscleFilter = "All" | ProgramBuilderMuscle

export type ProgramBuilderRepRange = {
  min: number
  max: number
  amrap?: boolean
}

export type ProgramBuilderTempo = {
  ecc: number
  pause1: number
  con: number
  pause2: number
}

export type ProgramBuilderIntensifierType =
  | "drop"
  | "rp"
  | "myo"
  | "cluster"
  | "partial"

export type ProgramBuilderSetIntensifier = {
  type: ProgramBuilderIntensifierType
  params: Record<string, number>
}

export type ProgramBuilderExerciseSet = ProgramBuilderRepRange & {
  int?: ProgramBuilderSetIntensifier
  tempo?: ProgramBuilderTempo | null
  rpe?: number | null
  rir?: number | null
}

export type ProgramBuilderExerciseLibraryItem = {
  id: number
  name: string
  muscle: ProgramBuilderMuscle
  type: ProgramBuilderExerciseType
}

export type ProgramBuilderExercise = {
  uid: string
  exerciseId: number
  name: string
  muscle: ProgramBuilderMuscle
  type: ProgramBuilderExerciseType
  sets: ProgramBuilderExerciseSet[]
}

export type ProgramBuilderDay = {
  id: string
  name: string
  isRest: boolean
  exercises: ProgramBuilderExercise[]
}

export type ProgramBuilderDayTemplate = {
  id: string
  name: string
  exercises: ProgramBuilderExercise[]
}

export type ProgramBuilderSetEditTarget = {
  uid: string
  si: number
}
