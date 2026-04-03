import type {
  FixedProgramEditorProgram,
  ProgramBuilderDay,
  ProgramBuilderExerciseEquipment,
  ProgramBuilderDayTemplate,
  ProgramBuilderExercise,
  ProgramBuilderExerciseLibraryItem,
  ProgramBuilderExerciseSet,
  ProgramBuilderExerciseLevel,
  ProgramBuilderIntensifierType,
  ProgramBuilderMuscle,
  ProgramBuilderMuscleFilter,
  ProgramBuilderRepRange,
  ProgramBuilderTempo,
  ProgramBuilderExerciseType,
} from "@/types"

export type ProgramBuilderIntensifierParameter = {
  key: string
  label: string
  min: number
  max: number
  step: number
  unit?: string
}

export type ProgramBuilderIntensifierDefinition = {
  label: string
  short: string
  defaults: Record<string, number>
  params: ProgramBuilderIntensifierParameter[]
  format: (params: Record<string, number>) => string
  className: string
}

export type ProgramBuilderExerciseTypeOption = {
  value: ProgramBuilderExerciseType
  label: string
  description: string
}

export type ProgramBuilderExerciseSelectOption<TValue extends string> = {
  value: TValue
  label: string
}

const rep = (min: number, max: number): ProgramBuilderExerciseSet => ({ min, max })

export const PROGRAM_BUILDER_EXERCISES: ProgramBuilderExerciseLibraryItem[] = [
  { id: 1, name: "Bench Press", muscle: "Chest", type: "compound_heavy" },
  { id: 2, name: "Incline Dumbbell Press", muscle: "Chest", type: "compound_medium" },
  { id: 3, name: "Cable Fly", muscle: "Chest", type: "isolation" },
  { id: 4, name: "Chest Dip", muscle: "Chest", type: "compound_medium" },
  { id: 5, name: "Pec Deck", muscle: "Chest", type: "isolation" },
  { id: 6, name: "Squat", muscle: "Legs", type: "compound_heavy" },
  { id: 7, name: "Romanian Deadlift", muscle: "Legs", type: "compound_medium" },
  { id: 8, name: "Leg Extension", muscle: "Legs", type: "isolation" },
  { id: 9, name: "Leg Curl", muscle: "Legs", type: "isolation" },
  { id: 10, name: "Bulgarian Split Squat", muscle: "Legs", type: "compound_medium" },
  { id: 11, name: "Leg Press", muscle: "Legs", type: "compound_medium" },
  { id: 12, name: "Hip Thrust", muscle: "Legs", type: "compound_medium" },
  { id: 13, name: "Calf Raise", muscle: "Legs", type: "isolation" },
  { id: 14, name: "Barbell Row", muscle: "Back", type: "compound_medium" },
  { id: 15, name: "Pull Up", muscle: "Back", type: "compound_heavy" },
  { id: 16, name: "Lat Pulldown", muscle: "Back", type: "compound_medium" },
  { id: 17, name: "Seated Cable Row", muscle: "Back", type: "compound_medium" },
  { id: 18, name: "Deadlift", muscle: "Back", type: "compound_heavy" },
  { id: 19, name: "T-Bar Row", muscle: "Back", type: "compound_medium" },
  { id: 20, name: "Overhead Press", muscle: "Shoulders", type: "compound_heavy" },
  { id: 21, name: "Lateral Raise", muscle: "Shoulders", type: "isolation" },
  { id: 22, name: "Face Pull", muscle: "Shoulders", type: "isolation" },
  { id: 23, name: "Rear Delt Fly", muscle: "Shoulders", type: "isolation" },
  { id: 24, name: "Arnold Press", muscle: "Shoulders", type: "compound_medium" },
  { id: 25, name: "Barbell Curl", muscle: "Arms", type: "isolation" },
  { id: 26, name: "Tricep Pushdown", muscle: "Arms", type: "isolation" },
  { id: 27, name: "Hammer Curl", muscle: "Arms", type: "isolation" },
  { id: 28, name: "Skull Crusher", muscle: "Arms", type: "isolation" },
  { id: 29, name: "Preacher Curl", muscle: "Arms", type: "isolation" },
  { id: 30, name: "Overhead Tricep Extension", muscle: "Arms", type: "isolation" },
  { id: 31, name: "Cable Crunch", muscle: "Core", type: "isolation" },
  { id: 32, name: "Hanging Leg Raise", muscle: "Core", type: "isolation" },
]

export const PROGRAM_BUILDER_MUSCLE_FILTERS: ProgramBuilderMuscleFilter[] = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
]

export const PROGRAM_BUILDER_DEFAULT_REP_RANGES = ["6-8", "8-10", "8-12", "10-12", "12-15"]

export const PROGRAM_BUILDER_EXERCISE_TYPE_OPTIONS: ProgramBuilderExerciseTypeOption[] = [
  {
    value: "compound_heavy",
    label: "Compound Heavy",
    description: "Lower rep strength work with bigger lifts.",
  },
  {
    value: "compound_medium",
    label: "Compound Medium",
    description: "Main accessory compounds with moderate reps.",
  },
  {
    value: "isolation",
    label: "Isolation",
    description: "Single-muscle focus work with higher reps.",
  },
]

export const PROGRAM_BUILDER_EXERCISE_LEVEL_OPTIONS: ProgramBuilderExerciseSelectOption<ProgramBuilderExerciseLevel>[] =
  [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ]

export const PROGRAM_BUILDER_EXERCISE_EQUIPMENT_OPTIONS: ProgramBuilderExerciseSelectOption<ProgramBuilderExerciseEquipment>[] =
  [
    { value: "Barbell", label: "Barbell" },
    { value: "Dumbbell", label: "Dumbbell" },
    { value: "Cable", label: "Cable" },
    { value: "Machine", label: "Machine" },
    { value: "Bodyweight", label: "Bodyweight" },
    { value: "Kettlebell", label: "Kettlebell" },
    { value: "Band", label: "Band" },
    { value: "Other", label: "Other" },
  ]

export const PROGRAM_BUILDER_ALL_REP_RANGES = [
  "1-3",
  "3-5",
  "4-6",
  "5-8",
  "6-8",
  "6-10",
  "8-10",
  "8-12",
  "10-12",
  "10-15",
  "12-15",
  "15-20",
  "20-25",
  "AMRAP",
]

export const PROGRAM_BUILDER_DEFAULT_TEMPOS = ["3-1-2-0", "4-0-1-0", "3-1-1-0", "2-0-2-0"]

export const PROGRAM_BUILDER_ALL_TEMPOS = [
  "2-0-2-0",
  "3-0-1-0",
  "3-1-1-0",
  "3-1-2-0",
  "3-1-2-1",
  "4-0-1-0",
  "4-1-1-0",
  "4-1-2-0",
  "4-2-1-0",
  "5-0-1-0",
  "2-0-1-3",
]

export const PROGRAM_BUILDER_RPE_OPTIONS = [6, 7, 8, 9, 10]

export const PROGRAM_BUILDER_RIR_OPTIONS = [0, 1, 2, 3, 4, 5]

export const PROGRAM_BUILDER_SMART_DEFAULTS: Record<
  ProgramBuilderExerciseLibraryItem["type"],
  ProgramBuilderExerciseSet[]
> = {
  compound_heavy: [rep(6, 8), rep(6, 8), rep(8, 10), rep(8, 10)],
  compound_medium: [rep(8, 10), rep(8, 12), rep(10, 12)],
  isolation: [rep(10, 12), rep(12, 15), rep(12, 15)],
}

export const PROGRAM_BUILDER_INTENSIFIERS: Record<
  ProgramBuilderIntensifierType,
  ProgramBuilderIntensifierDefinition
> = {
  drop: {
    label: "Drop set",
    short: "Drop",
    defaults: { drops: 3 },
    params: [{ key: "drops", label: "Drops", min: 1, max: 6, step: 1 }],
    format: (params) => `Drop ${params.drops}x`,
    className: "border-orange-200 bg-orange-50 text-orange-700",
  },
  rp: {
    label: "Rest-pause",
    short: "RP",
    defaults: { rest: 15 },
    params: [{ key: "rest", label: "Rest", min: 5, max: 60, step: 5, unit: "s" }],
    format: (params) => `RP ${params.rest}s`,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  myo: {
    label: "Myo reps",
    short: "Myo",
    defaults: { miniSets: 5, reps: 3 },
    params: [
      { key: "miniSets", label: "Mini sets", min: 2, max: 8, step: 1 },
      { key: "reps", label: "Reps", min: 2, max: 6, step: 1 },
    ],
    format: (params) => `Myo ${params.miniSets}x${params.reps}`,
    className: "border-pink-200 bg-pink-50 text-pink-700",
  },
  cluster: {
    label: "Cluster",
    short: "Cluster",
    defaults: { segments: 3, reps: 3, rest: 15 },
    params: [
      { key: "segments", label: "Segments", min: 2, max: 6, step: 1 },
      { key: "reps", label: "Reps", min: 1, max: 6, step: 1 },
      { key: "rest", label: "Rest", min: 5, max: 45, step: 5, unit: "s" },
    ],
    format: (params) => `Cluster ${params.segments}x${params.reps}`,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  partial: {
    label: "Partial reps",
    short: "Partial",
    defaults: {},
    params: [],
    format: () => "Partial",
    className: "border-neutral-200 bg-neutral-100 text-neutral-700",
  },
}

export const PROGRAM_BUILDER_MUSCLE_CLASSES: Record<ProgramBuilderMuscle, string> = {
  Chest: "border-rose-100 bg-rose-50/70 text-rose-700",
  Back: "border-violet-100 bg-violet-50/70 text-violet-700",
  Legs: "border-sky-100 bg-sky-50/70 text-sky-700",
  Shoulders: "border-amber-100 bg-amber-50/70 text-amber-700",
  Arms: "border-emerald-100 bg-emerald-50/70 text-emerald-700",
  Core: "border-fuchsia-100 bg-fuchsia-50/70 text-fuchsia-700",
}

export function createProgramBuilderId(prefix = "program-builder") {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function parseProgramBuilderRepRange(value: string): ProgramBuilderRepRange | null {
  if (!value) {
    return null
  }

  if (value.trim().toUpperCase() === "AMRAP") {
    return { min: 0, max: 0, amrap: true }
  }

  const cleanedValue = value.replace(/\s/g, "")
  const [left, right] = cleanedValue.split("-")
  const firstValue = Number.parseInt(left, 10)
  const secondValue = Number.parseInt(right ?? left, 10)

  if (Number.isNaN(firstValue) || Number.isNaN(secondValue)) {
    return null
  }

  return {
    min: Math.min(firstValue, secondValue),
    max: Math.max(firstValue, secondValue),
  }
}

export function formatProgramBuilderRepRange(range: ProgramBuilderRepRange) {
  if (range.amrap) {
    return "AMRAP"
  }

  return range.min === range.max ? `${range.min}` : `${range.min}-${range.max}`
}

export function parseProgramBuilderTempo(value: string): ProgramBuilderTempo | null {
  const parts = value.split("-").map((part) => Number.parseInt(part, 10))
  if (parts.length !== 4 || parts.some(Number.isNaN)) {
    return null
  }

  return {
    ecc: parts[0],
    pause1: parts[1],
    con: parts[2],
    pause2: parts[3],
  }
}

export function formatProgramBuilderTempo(value: ProgramBuilderTempo) {
  return `${value.ecc}-${value.pause1}-${value.con}-${value.pause2}`
}

export function createProgramBuilderExerciseEntry(
  exercise: ProgramBuilderExerciseLibraryItem
): ProgramBuilderExercise {
  return {
    uid: createProgramBuilderId("program-exercise"),
    exerciseId: exercise.id,
    name: exercise.name,
    muscle: exercise.muscle,
    type: exercise.type,
    instructions: exercise.instructions ?? null,
    sets: PROGRAM_BUILDER_SMART_DEFAULTS[exercise.type].map((set) => ({ ...set })),
  }
}

export function createProgramBuilderLibraryExercise(
  exercises: ProgramBuilderExerciseLibraryItem[],
  input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
    instructions?: string | null
    equipment?: ProgramBuilderExerciseEquipment[] | null
    level?: ProgramBuilderExerciseLevel | null
    youtubeUrl?: string | null
    mediaFileName?: string | null
  }
): ProgramBuilderExerciseLibraryItem {
  const nextId =
    exercises.reduce((highestId, exercise) => Math.max(highestId, exercise.id), 0) + 1

  return {
    id: nextId,
    name: input.name.trim(),
    muscle: input.muscle,
    type: input.type,
    instructions: input.instructions?.trim() || null,
    equipment: input.equipment?.length ? [...input.equipment] : null,
    level: input.level ?? null,
    youtubeUrl: input.youtubeUrl?.trim() || null,
    mediaFileName: input.mediaFileName ?? null,
  }
}

export function cloneProgramBuilderExercise(
  exercise: ProgramBuilderExercise
): ProgramBuilderExercise {
  return {
    ...exercise,
    sets: exercise.sets.map((set) => ({
      ...set,
      int: set.int ? { ...set.int, params: { ...set.int.params } } : undefined,
      tempo: set.tempo ? { ...set.tempo } : set.tempo,
      rpe: set.rpe ?? null,
      rir: set.rir ?? null,
    })),
  }
}

export function cloneProgramBuilderDay(day: ProgramBuilderDay): ProgramBuilderDay {
  return {
    ...day,
    exercises: day.exercises.map(cloneProgramBuilderExercise),
  }
}

function normalizeProgramBuilderExerciseName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

function resolveProgramBuilderExerciseMatch(exerciseName: string) {
  const normalizedName = normalizeProgramBuilderExerciseName(exerciseName)

  return (
    PROGRAM_BUILDER_EXERCISES.find(
      (exercise) => normalizeProgramBuilderExerciseName(exercise.name) === normalizedName
    ) ??
    PROGRAM_BUILDER_EXERCISES.find((exercise) =>
      normalizedName.includes(normalizeProgramBuilderExerciseName(exercise.name))
    ) ??
    PROGRAM_BUILDER_EXERCISES.find((exercise) =>
      normalizeProgramBuilderExerciseName(exercise.name).includes(normalizedName)
    )
  )
}

function inferProgramBuilderMuscle(
  workoutLabel: string,
  sectionTitle: string,
  exerciseName: string
): ProgramBuilderMuscle {
  const normalizedContext = `${workoutLabel} ${sectionTitle} ${exerciseName}`.toLowerCase()

  if (normalizedContext.includes("chest") || normalizedContext.includes("push")) {
    return "Chest"
  }

  if (
    normalizedContext.includes("leg") ||
    normalizedContext.includes("lower") ||
    normalizedContext.includes("glute")
  ) {
    return "Legs"
  }

  if (normalizedContext.includes("shoulder")) {
    return "Shoulders"
  }

  if (normalizedContext.includes("arm") || normalizedContext.includes("bicep") || normalizedContext.includes("tricep")) {
    return "Arms"
  }

  if (normalizedContext.includes("core") || normalizedContext.includes("abs")) {
    return "Core"
  }

  return "Back"
}

function inferProgramBuilderExerciseType(
  exerciseName: string
): ProgramBuilderExerciseType {
  const normalizedName = exerciseName.toLowerCase()

  if (
    normalizedName.includes("curl") ||
    normalizedName.includes("raise") ||
    normalizedName.includes("fly") ||
    normalizedName.includes("extension") ||
    normalizedName.includes("pushdown") ||
    normalizedName.includes("crunch")
  ) {
    return "isolation"
  }

  if (
    normalizedName.includes("bench") ||
    normalizedName.includes("squat") ||
    normalizedName.includes("deadlift") ||
    normalizedName.includes("pull up")
  ) {
    return "compound_heavy"
  }

  return "compound_medium"
}

function resolveProgramBuilderInitialSetCount(
  fields: string[],
  values: string[],
  fallbackType: ProgramBuilderExerciseType
) {
  const setsFieldIndex = fields.findIndex(
    (field) => field.trim().toLowerCase() === "sets"
  )
  const parsedSetCount =
    setsFieldIndex >= 0 ? Number.parseInt(values[setsFieldIndex] ?? "", 10) : Number.NaN
  const resolvedSetCount = Number.isNaN(parsedSetCount)
    ? PROGRAM_BUILDER_SMART_DEFAULTS[fallbackType].length
    : Math.min(Math.max(parsedSetCount, 1), 6)

  return resolvedSetCount
}

function createProgramBuilderInitialSets(
  type: ProgramBuilderExerciseType,
  setCount: number
) {
  const defaults = PROGRAM_BUILDER_SMART_DEFAULTS[type]

  return Array.from({ length: setCount }, (_, index) => ({
    ...defaults[Math.min(index, defaults.length - 1)],
  }))
}

function createProgramBuilderInitialExerciseFromEditor(
  workoutLabel: string,
  sectionTitle: string,
  exercise: FixedProgramEditorProgram["editorWorkouts"][number]["sections"][number]["exercises"][number]
): ProgramBuilderExercise {
  const matchedExercise = resolveProgramBuilderExerciseMatch(exercise.name)
  const type = matchedExercise?.type ?? inferProgramBuilderExerciseType(exercise.name)
  const setCount = resolveProgramBuilderInitialSetCount(exercise.fields, exercise.values, type)

  return {
    uid: createProgramBuilderId("program-exercise"),
    exerciseId:
      matchedExercise?.id ??
      Math.abs(
        Array.from(`${workoutLabel}-${sectionTitle}-${exercise.name}`).reduce(
          (hash, character) => (hash * 31 + character.charCodeAt(0)) | 0,
          0
        )
      ) +
        1000,
    name: exercise.name,
    muscle:
      matchedExercise?.muscle ??
      inferProgramBuilderMuscle(workoutLabel, sectionTitle, exercise.name),
    type,
    instructions: exercise.note?.trim() || null,
    sets: createProgramBuilderInitialSets(type, setCount),
  }
}

export function createProgramBuilderInitialDays(
  program: FixedProgramEditorProgram
): ProgramBuilderDay[] {
  if (program.editorWorkouts.length > 0) {
    return program.editorWorkouts.map((workout) => {
      const isRest =
        /\brest\b/i.test(workout.label) ||
        /\brecovery\b/i.test(workout.intro)

      return {
        id: createProgramBuilderId("program-day"),
        name: workout.label,
        isRest,
        exercises: isRest
          ? []
          : workout.sections.flatMap((section) =>
              section.exercises.map((exercise) =>
                createProgramBuilderInitialExerciseFromEditor(
                  workout.label,
                  section.title,
                  exercise
                )
              )
            ),
      }
    })
  }

  if (program.workouts.length > 0) {
    return program.workouts.map((label) => ({
      id: createProgramBuilderId("program-day"),
      name: label,
      isRest: false,
      exercises: [],
    }))
  }

  return [
    {
      id: createProgramBuilderId("program-day"),
      name: "Workout 1",
      isRest: false,
      exercises: [],
    },
  ]
}

function createTemplate(templateName: string, exerciseIds: number[]): ProgramBuilderDayTemplate {
  return {
    id: createProgramBuilderId("program-template"),
    name: templateName,
    exercises: exerciseIds
      .map((exerciseId) => PROGRAM_BUILDER_EXERCISES.find((exercise) => exercise.id === exerciseId))
      .filter((exercise): exercise is ProgramBuilderExerciseLibraryItem => Boolean(exercise))
      .map(createProgramBuilderExerciseEntry),
  }
}

export function createProgramBuilderDefaultTemplates(): ProgramBuilderDayTemplate[] {
  return [
    createTemplate("Push (Sample)", [1, 2, 20, 21, 26]),
    createTemplate("Pull (Sample)", [14, 16, 17, 22, 25]),
  ]
}
