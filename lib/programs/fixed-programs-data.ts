import type { FixedProgramEditorProgram } from "@/types"

export const fixedProgramExerciseLibrary = [
  "Barbell Bench Press",
  "Bodyweight Half Squat",
  "Bodyweight Squat",
  "Dumbbell Standing Biceps Curl",
  "Push-up",
  "Run",
  "Run on Treadmill",
  "Squat",
  "Walking",
  "Walking on Treadmill",
  "Arm Circles",
  "Bar Biceps Curl",
]

const fixedProgramsCatalog: FixedProgramEditorProgram[] = [
  {
    id: "empty-program",
    title: "aa",
    description: "aaa",
    workouts: [],
    editorWorkouts: [],
  },
  {
    id: "full-body-sample",
    title: "Full Body (Sample)",
    workouts: ["Chest & Shoulder", "Back", "Arms", "Legs"],
    description:
      "This 4-day program will help intermediate and advanced trainees gain size and strength. Rest-pause sets, drop sets, and creative unilateral work are included.",
    editorWorkouts: [
      {
        id: "chest-shoulder",
        label: "Chest & Shoulder",
        intro:
          "Start your week with a chest workout that includes a variety of exercises. This workout is designed to target all areas of your chest, including the upper, lower, and middle portions.",
        sections: [
          {
            id: "warmup",
            title: "Warmup",
            tone: "dark",
            note:
              "Start your workout with a warmup to get your blood flowing and your muscles ready for the workout.",
            exercises: [
              {
                id: "jumping-jack",
                name: "Jumping Jack",
                note: "Add a custom note for this exercise",
                fields: ["Sets", "Time", "(Optional)", "(Optional)", "(Optional)"],
                values: ["1", "30", "", "", ""],
              },
              {
                id: "arm-circles",
                name: "Arm Circles",
                note: "Add a custom note for this exercise",
                fields: ["Sets", "Time", "(Optional)", "(Optional)", "(Optional)"],
                values: ["1", "30", "", "", ""],
              },
            ],
          },
        ],
      },
      {
        id: "back",
        label: "Back",
        intro:
          "This back session balances vertical and horizontal pulling with enough warmup volume to keep the shoulders healthy.",
        sections: [],
      },
      {
        id: "arms",
        label: "Arms",
        intro:
          "Use this arm day to focus on controlled reps, elbow-friendly tempos and consistent pump work.",
        sections: [],
      },
      {
        id: "legs",
        label: "Legs",
        intro:
          "A lower body session focused on squat patterns, hinge work and stable progression from week to week.",
        sections: [],
      },
    ],
  },
]

export function getFixedPrograms(): FixedProgramEditorProgram[] {
  return fixedProgramsCatalog
}

export function getFixedProgramEditorProgram(
  programId: string,
  title: string
): FixedProgramEditorProgram {
  const existingProgram = fixedProgramsCatalog.find((program) => program.id === programId)

  if (existingProgram) {
    return existingProgram
  }

  return {
    id: programId,
    title,
    description: `Build and organize the ${title} program with custom workouts and exercises.`,
    workouts: [],
    editorWorkouts: [],
  }
}
