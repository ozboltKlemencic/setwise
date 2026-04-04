"use client"

import * as React from "react"

import { ProgramExerciseDetailPage } from "@/components/coachWise/clients/programs/program-exercise-detail-page"
import {
  PROGRAM_EXERCISES_UPDATED_EVENT,
  readStoredProgramExercises,
} from "@/lib/handlers/program-exercise-storage"
import { PROGRAM_BUILDER_EXERCISES } from "@/lib/programs/program-builder-data"
import type { ProgramBuilderExerciseLibraryItem } from "@/types"

type ProgramExerciseDetailViewProps = {
  exerciseId: string
  backHref: string
}

function ProgramExerciseDetailViewComponent({
  exerciseId,
  backHref,
}: ProgramExerciseDetailViewProps) {
  const parsedExerciseId = Number(exerciseId)
  const seedExercise = React.useMemo<ProgramBuilderExerciseLibraryItem | null>(() => {
    if (!Number.isFinite(parsedExerciseId)) {
      return null
    }

    return (
      readStoredProgramExercises().find((exercise) => exercise.id === parsedExerciseId) ??
      PROGRAM_BUILDER_EXERCISES.find((exercise) => exercise.id === parsedExerciseId) ??
      null
    )
  }, [parsedExerciseId])
  const [hasLoaded, setHasLoaded] = React.useState(false)
  const [exercise, setExercise] = React.useState<ProgramBuilderExerciseLibraryItem | null>(
    seedExercise
  )

  React.useEffect(() => {
    if (!Number.isFinite(parsedExerciseId)) {
      setHasLoaded(true)
      setExercise(null)
      return
    }

    const syncExercise = () => {
      const nextExercise =
        readStoredProgramExercises().find(
          (storedExercise) => storedExercise.id === parsedExerciseId
        ) ??
        PROGRAM_BUILDER_EXERCISES.find(
          (libraryExercise) => libraryExercise.id === parsedExerciseId
        ) ??
        null

      setExercise(nextExercise)
      setHasLoaded(true)
    }

    syncExercise()
    window.addEventListener(PROGRAM_EXERCISES_UPDATED_EVENT, syncExercise)

    return () => {
      window.removeEventListener(PROGRAM_EXERCISES_UPDATED_EVENT, syncExercise)
    }
  }, [parsedExerciseId])

  if (!hasLoaded) {
    return null
  }

  if (!exercise) {
    return (
      <div className="px-4 py-4 text-sm text-neutral-500">
        Exercise not found.
      </div>
    )
  }

  return <ProgramExerciseDetailPage exercise={exercise} backHref={backHref} />
}

export const ProgramExerciseDetailView = React.memo(
  ProgramExerciseDetailViewComponent
)
