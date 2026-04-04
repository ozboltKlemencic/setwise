"use client"

import * as React from "react"
import { toast } from "sonner"

import { ProgramBuilderCreateExerciseDialog } from "@/components/coachWise/clients/programs/builder/program-builder-create-exercise-dialog"
import { ProgramExerciseDetailPage } from "@/components/coachWise/clients/programs/program-exercise-detail-page"
import {
  PROGRAM_EXERCISES_UPDATED_EVENT,
  readStoredProgramExercises,
  upsertStoredProgramExercise,
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
  const [isEditExerciseOpen, setIsEditExerciseOpen] = React.useState(false)
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

  const isCustomExercise = !PROGRAM_BUILDER_EXERCISES.some(
    (libraryExercise) => libraryExercise.id === exercise.id
  )

  const handleEditExercise = (
    input: Pick<ProgramBuilderExerciseLibraryItem, "name" | "muscle" | "type"> & {
      instructions?: string | null
      equipment?: ProgramBuilderExerciseLibraryItem["equipment"]
      youtubeUrl?: string | null
      mediaFileName?: string | null
    }
  ) => {
    const nextExercise = {
      ...exercise,
      name: input.name.trim(),
      muscle: input.muscle,
      type: input.type,
      instructions: input.instructions?.trim() || null,
      equipment: input.equipment?.length ? [...input.equipment] : null,
      youtubeUrl: input.youtubeUrl?.trim() || null,
      mediaFileName: input.mediaFileName ?? null,
    }

    upsertStoredProgramExercise(nextExercise)
    setExercise(nextExercise)
    toast.success("Exercise updated", {
      description: `${nextExercise.name} was updated in the coach exercise library.`,
    })
  }

  return (
    <>
      {isCustomExercise ? (
        <ProgramBuilderCreateExerciseDialog
          open={isEditExerciseOpen}
          onOpenChange={setIsEditExerciseOpen}
          initialName={exercise.name}
          initialExercise={exercise}
          submitLabel="Save Exercise"
          onCreate={handleEditExercise}
        />
      ) : null}

      <ProgramExerciseDetailPage
        exercise={exercise}
        backHref={backHref}
        onEdit={isCustomExercise ? () => setIsEditExerciseOpen(true) : undefined}
      />
    </>
  )
}

export const ProgramExerciseDetailView = React.memo(
  ProgramExerciseDetailViewComponent
)
