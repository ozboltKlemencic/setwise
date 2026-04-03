"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Dumbbell, Pencil } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
import { PROGRAM_BUILDER_MUSCLE_CLASSES } from "@/lib/programs/program-builder-data"
import type { StoredProgramPlan } from "@/types"
import { cn } from "@/lib/utils"

function ProgramPlanDetailNav({
  title,
  backHref,
  editHref,
}: {
  title: string
  backHref: string
  editHref: string
}) {
  const router = useRouter()

  return (
    <div className="sticky top-(--header-height) z-10 bg-neutral-50">
      <div className="flex h-12 items-center justify-between gap-x-3 border-b border-neutral-200 px-2">
        <div className="flex h-full min-w-0 items-center gap-x-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push(backHref)}
            className="size-7 self-center rounded-sm text-neutral-600 shadow-none hover:bg-neutral-100 hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Button>

          <div className="flex h-full min-w-0 items-center">
            <div className="inline-flex h-8 max-w-full items-center text-left text-[15px] leading-none font-semibold text-neutral-950">
              <span className="truncate">{title}</span>
            </div>
          </div>
        </div>

        <PrimaryActionButton
          label="Edit Program"
          icon={Pencil}
          href={editHref}
          className="h-8 self-center leading-none"
        />
      </div>
    </div>
  )
}

function ProgramExerciseValuesGrid({
  fields,
  values,
}: {
  fields: string[]
  values: string[]
}) {
  if (fields.length === 0 || values.length === 0) {
    return null
  }

  const gridTemplateColumns = `repeat(${fields.length}, minmax(0, 1fr))`

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div
        className="grid border-b border-neutral-200 bg-neutral-50 text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400"
        style={{ gridTemplateColumns }}
      >
        {fields.map((field) => (
          <div
            key={field}
            className="border-r border-neutral-200 px-3 py-2.5 last:border-r-0"
          >
            {field}
          </div>
        ))}
      </div>
      <div
        className="grid bg-white text-[13px] font-medium text-neutral-800"
        style={{ gridTemplateColumns }}
      >
        {values.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className="border-r border-neutral-200 px-3 py-3 last:border-r-0"
          >
            {value}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgramWorkoutTabs({
  workouts,
  activeWorkoutId,
  onSelectWorkout,
}: {
  workouts: StoredProgramPlan["program"]["editorWorkouts"]
  activeWorkoutId: string
  onSelectWorkout: (workoutId: string) => void
}) {
  return (
    <div className="border-b border-neutral-200 bg-neutral-50 px-2">
      <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto">
        {workouts.map((workout) => {
          const isActive = workout.id === activeWorkoutId

          return (
            <button
              key={workout.id}
              type="button"
              onClick={() => onSelectWorkout(workout.id)}
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 border-b-2 border-transparent bg-transparent px-3 py-2.5 text-[13px] transition-colors",
                isActive
                  ? "border-brand-500 font-medium text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-800"
              )}
            >
              <Dumbbell
                className={cn(
                  "size-3.5 transition-colors",
                  isActive ? "text-brand-600" : "text-neutral-400"
                )}
              />
              <span>{workout.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ProgramWorkoutExercises({
  workout,
  summaryText,
}: {
  workout: StoredProgramPlan["program"]["editorWorkouts"][number]
  summaryText: string
}) {
  const exercises = workout.sections.flatMap((section) => section.exercises)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="truncate text-[18px] font-semibold tracking-[-0.02em] text-neutral-950">
          {workout.label}
        </div>
        <div className="shrink-0 text-right text-[13px] text-neutral-500">
          {summaryText}
        </div>
      </div>

      <div className="space-y-3">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="truncate text-[14px] font-semibold text-neutral-950">
                {exercise.name}
              </div>
              {exercise.note ? (
                <span
                  className={cn(
                    "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                    PROGRAM_BUILDER_MUSCLE_CLASSES.Back
                  )}
                >
                  Cue
                </span>
              ) : null}
            </div>

            {exercise.note ? (
              <div className="mt-2 text-[12px] leading-5 text-neutral-500">
                {exercise.note}
              </div>
            ) : null}

            <div className="mt-3">
              <ProgramExerciseValuesGrid
                fields={exercise.fields}
                values={exercise.values}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProgramPlanDetailPage({
  plan,
  backHref,
  editHref,
}: {
  plan: StoredProgramPlan
  backHref: string
  editHref: string
}) {
  const workoutSummaryText = `${plan.program.editorWorkouts.length} workouts`
  const [activeWorkoutId, setActiveWorkoutId] = React.useState(
    plan.program.editorWorkouts[0]?.id ?? ""
  )

  React.useEffect(() => {
    setActiveWorkoutId(plan.program.editorWorkouts[0]?.id ?? "")
  }, [plan.id, plan.program.editorWorkouts])

  const activeWorkout =
    plan.program.editorWorkouts.find((workout) => workout.id === activeWorkoutId) ??
    plan.program.editorWorkouts[0] ??
    null

  return (
    <div className="min-w-0 bg-neutral-50">
      <ProgramPlanDetailNav
        title={plan.title}
        backHref={backHref}
        editHref={editHref}
      />

      <div className="mx-auto max-w-[1080px] space-y-4 px-4 py-4">
        {plan.program.editorWorkouts.length > 0 && activeWorkout ? (
          <div className="space-y-4">
            <ProgramWorkoutTabs
              workouts={plan.program.editorWorkouts}
              activeWorkoutId={activeWorkout.id}
              onSelectWorkout={setActiveWorkoutId}
            />

            <ProgramWorkoutExercises
              workout={activeWorkout}
              summaryText={workoutSummaryText}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
