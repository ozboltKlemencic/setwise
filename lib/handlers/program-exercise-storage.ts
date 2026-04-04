"use client"

import type { ProgramBuilderExerciseLibraryItem } from "@/types"

const PROGRAM_EXERCISE_STORAGE_KEY = "coachwise:program-exercises"

export const PROGRAM_EXERCISES_UPDATED_EVENT = "coachwise:program-exercises-updated"

function isStoredProgramExercise(value: unknown): value is ProgramBuilderExerciseLibraryItem {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<ProgramBuilderExerciseLibraryItem>
  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    typeof candidate.muscle === "string" &&
    typeof candidate.type === "string"
  )
}

function dispatchProgramExercisesUpdated() {
  if (typeof window === "undefined") {
    return
  }

  window.dispatchEvent(new CustomEvent(PROGRAM_EXERCISES_UPDATED_EVENT))
}

export function readStoredProgramExercises() {
  if (typeof window === "undefined") {
    return [] as ProgramBuilderExerciseLibraryItem[]
  }

  try {
    const rawValue = window.localStorage.getItem(PROGRAM_EXERCISE_STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue = JSON.parse(rawValue)
    return Array.isArray(parsedValue)
      ? parsedValue.filter(isStoredProgramExercise)
      : []
  } catch {
    return []
  }
}

export function writeStoredProgramExercises(exercises: ProgramBuilderExerciseLibraryItem[]) {
  if (typeof window === "undefined") {
    return
  }

  if (!exercises.length) {
    window.localStorage.removeItem(PROGRAM_EXERCISE_STORAGE_KEY)
    dispatchProgramExercisesUpdated()
    return
  }

  window.localStorage.setItem(PROGRAM_EXERCISE_STORAGE_KEY, JSON.stringify(exercises))
  dispatchProgramExercisesUpdated()
}

export function upsertStoredProgramExercise(exercise: ProgramBuilderExerciseLibraryItem) {
  const currentExercises = readStoredProgramExercises()
  writeStoredProgramExercises([
    exercise,
    ...currentExercises.filter((currentExercise) => currentExercise.id !== exercise.id),
  ])
}
