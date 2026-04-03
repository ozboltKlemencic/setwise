"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Dumbbell, Pencil } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { ProgramBuilderExerciseNotesMenu } from "@/components/coachWise/clients/programs/builder/program-builder-exercise-notes-menu"
import { Button } from "@/components/ui/button"
import {
  formatProgramBuilderRepRange,
  formatProgramBuilderTempo,
  PROGRAM_BUILDER_INTENSIFIERS,
  PROGRAM_BUILDER_MUSCLE_CLASSES,
} from "@/lib/programs/program-builder-data"
import type { ProgramBuilderDay, ProgramBuilderExercise, StoredProgramPlan } from "@/types"
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

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      {fields.map((field, index) => (
        <div
          key={`${field}-${index}`}
          className="flex items-center justify-between gap-4 border-b border-neutral-200 px-3 py-3 last:border-b-0"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-neutral-400">
            {field}
          </span>
          <span className="text-right text-[13px] font-medium text-neutral-800">
            {values[index] ?? "-"}
          </span>
        </div>
      ))}
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
    <div className="border-b border-neutral-200 bg-neutral-50">
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

function ProgramDetailSetMetaTag({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-semibold",
        className
      )}
    >
      <span>{label}</span>
    </div>
  )
}

function ProgramDetailBuilderExerciseCard({
  exercise,
}: {
  exercise: ProgramBuilderExercise
}) {
  const instructions = exercise.instructions?.trim() || null

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-[0_1px_2px_rgba(17,24,39,0.04)]">
      <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
        <div className="min-w-0 flex-1 pl-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <div className="truncate text-[14px] font-semibold text-neutral-950">
              {exercise.name}
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]",
                PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle]
              )}
            >
              {exercise.muscle}
            </span>
          </div>
        </div>

        {instructions ? (
          <div className="flex items-center gap-1.5">
            <ProgramBuilderExerciseNotesMenu description={instructions} readOnly />
          </div>
        ) : null}
      </div>

      <div className="space-y-2 px-4 py-4">
        {exercise.sets.map((set, setIndex) => (
          <div
            key={`${exercise.uid}-${setIndex}`}
            className="rounded-xl border border-neutral-200 bg-neutral-50/70 px-3 py-3"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-400">
                  Set {setIndex + 1}
                </span>
                <div className="min-w-0 font-mono text-[14px] font-semibold text-neutral-900">
                  {formatProgramBuilderRepRange(set)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
                {set.int ? (
                  <ProgramDetailSetMetaTag
                    className={PROGRAM_BUILDER_INTENSIFIERS[set.int.type].className}
                    label={PROGRAM_BUILDER_INTENSIFIERS[set.int.type].format(set.int.params)}
                  />
                ) : null}

                {set.tempo ? (
                  <ProgramDetailSetMetaTag
                    className="border-emerald-200 bg-emerald-50 text-emerald-700"
                    label={formatProgramBuilderTempo(set.tempo)}
                  />
                ) : null}

                {typeof set.rpe === "number" ? (
                  <ProgramDetailSetMetaTag
                    className="border-violet-200 bg-violet-50 text-violet-700"
                    label={`RPE ${set.rpe}`}
                  />
                ) : null}

                {typeof set.rir === "number" ? (
                  <ProgramDetailSetMetaTag
                    className="border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700"
                    label={`RIR ${set.rir}`}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function parseSetsValueFromExercise(
  exercise: StoredProgramPlan["program"]["editorWorkouts"][number]["sections"][number]["exercises"][number]
) {
  const setsFieldIndex = exercise.fields.findIndex(
    (field) => field.trim().toLowerCase() === "sets"
  )

  if (setsFieldIndex < 0) {
    return 0
  }

  const parsedValue = Number.parseInt(exercise.values[setsFieldIndex] ?? "", 10)
  return Number.isNaN(parsedValue) ? 0 : parsedValue
}

function countWorkoutSetsFromEditorWorkout(
  workout: StoredProgramPlan["program"]["editorWorkouts"][number]
) {
  return workout.sections.reduce(
    (total, section) =>
      total +
      section.exercises.reduce(
        (sectionTotal, exercise) => sectionTotal + parseSetsValueFromExercise(exercise),
        0
      ),
    0
  )
}

function ProgramWorkoutExercises({
  workout,
  summaryText,
  builderDay,
}: {
  workout: StoredProgramPlan["program"]["editorWorkouts"][number]
  summaryText: string
  builderDay?: ProgramBuilderDay | null
}) {
  const exercises = workout.sections.flatMap((section) => section.exercises)
  const builderExercises = builderDay?.exercises ?? null

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
        {builderExercises
          ? builderExercises.map((exercise) => (
            <ProgramDetailBuilderExerciseCard key={exercise.uid} exercise={exercise} />
          ))
          : exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <div className="truncate text-[14px] font-semibold text-neutral-950">
                  {exercise.name}
                </div>
                {exercise.note ? (
                  <span className="inline-flex shrink-0 rounded-md border border-violet-100 bg-violet-50/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-violet-700">
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
  const activeWorkoutIndex = activeWorkout
    ? plan.program.editorWorkouts.findIndex((workout) => workout.id === activeWorkout.id)
    : -1
  const activeBuilderDay =
    activeWorkoutIndex >= 0 ? plan.builderSnapshot?.days[activeWorkoutIndex] ?? null : null
  const workoutCount = plan.program.editorWorkouts.length
  const exerciseCount =
    plan.builderSnapshot?.days.reduce(
      (total, day) => total + day.exercises.length,
      0
    ) ??
    plan.program.editorWorkouts.reduce(
      (total, workout) =>
        total +
        workout.sections.reduce(
          (sectionTotal, section) => sectionTotal + section.exercises.length,
          0
        ),
      0
    )
  const setCount =
    plan.builderSnapshot?.days.reduce(
      (total, day) =>
        total +
        day.exercises.reduce(
          (exerciseTotal, exercise) => exerciseTotal + exercise.sets.length,
          0
        ),
      0
    ) ??
    plan.program.editorWorkouts.reduce(
      (total, workout) => total + countWorkoutSetsFromEditorWorkout(workout),
      0
    )
  const sectionCount =
    plan.builderSnapshot?.days.filter((day) => !day.isRest).length ??
    plan.program.editorWorkouts.reduce(
      (total, workout) => total + workout.sections.length,
      0
    )
  const workoutSummaryText = `${workoutCount} workouts - ${exerciseCount} exercises - ${setCount} sets - ${sectionCount} sections`

  return (
    <div className="min-w-0 bg-neutral-50">
      <ProgramPlanDetailNav
        title={plan.title}
        backHref={backHref}
        editHref={editHref}
      />

      <div className="mx-auto max-w-3xl space-y-4 px-4 py-4">
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
              builderDay={activeBuilderDay}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
