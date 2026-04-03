"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Dumbbell, Pencil } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { Button } from "@/components/ui/button"
import { PROGRAM_BUILDER_MUSCLE_CLASSES } from "@/lib/programs/program-builder-data"
import { cn } from "@/lib/utils"
import type { StoredProgramPlan } from "@/types"

function countProgramExercises(plan: StoredProgramPlan) {
  return plan.program.editorWorkouts.reduce(
    (total, workout) =>
      total +
      workout.sections.reduce(
        (sectionTotal, section) => sectionTotal + section.exercises.length,
        0
      ),
    0
  )
}

function countProgramSections(plan: StoredProgramPlan) {
  return plan.program.editorWorkouts.reduce(
    (total, workout) => total + workout.sections.length,
    0
  )
}

function ProgramDetailMetricCard({
  label,
  value,
  description,
  progressClassName,
}: {
  label: string
  value: string
  description: string
  progressClassName: string
}) {
  return (
    <div className="relative min-h-[86px] bg-white px-4 py-3">
      <div className="text-[24px] leading-none font-semibold text-neutral-950">
        {value}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </div>
      <div className="absolute right-4 bottom-3 text-[12px] font-medium text-neutral-500">
        {description}
      </div>
      <div className="absolute right-0 bottom-0 left-0 h-[3px]">
        <div className={cn("h-full w-full", progressClassName)} />
      </div>
    </div>
  )
}

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

function ProgramWorkoutCard({
  workout,
}: {
  workout: StoredProgramPlan["program"]["editorWorkouts"][number]
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-200 bg-neutral-100/70 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-neutral-950">
            {workout.label}
          </div>
          <div className="mt-1 text-[12px] text-neutral-500">{workout.intro}</div>
        </div>

        <div className="shrink-0 text-[12px] text-neutral-500">
          {workout.sections.reduce(
            (total, section) => total + section.exercises.length,
            0
          )}{" "}
          exercises
        </div>
      </div>

      <div className="space-y-4 px-4 py-4">
        {workout.sections.map((section) => (
          <div key={section.id} className="space-y-3">
            <div>
              <div className="text-[13px] font-semibold text-neutral-950">
                {section.title}
              </div>
              <div className="mt-1 text-[12px] text-neutral-500">{section.note}</div>
            </div>

            <div className="space-y-3">
              {section.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4"
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
      <div className="flex items-center gap-1.5 overflow-x-auto">
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

export function ProgramPlanDetailPage({
  plan,
  backHref,
  editHref,
}: {
  plan: StoredProgramPlan
  backHref: string
  editHref: string
}) {
  const workoutCount = plan.program.editorWorkouts.length
  const exerciseCount = countProgramExercises(plan)
  const sectionCount = countProgramSections(plan)
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

      <div className="mx-auto max-w-[1080px] space-y-6 px-4 py-5">
        <div className="text-[14px] text-neutral-500">{plan.description}</div>

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="grid md:grid-cols-3">
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <ProgramDetailMetricCard
                label="Workouts"
                value={String(workoutCount)}
                description="Scheduled days"
                progressClassName="bg-brand-500"
              />
            </div>
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <ProgramDetailMetricCard
                label="Exercises"
                value={String(exerciseCount)}
                description="Across all workouts"
                progressClassName="bg-emerald-500"
              />
            </div>
            <div className="border-b border-neutral-200 md:border-r md:border-b-0">
              <ProgramDetailMetricCard
                label="Sections"
                value={String(sectionCount)}
                description="Workout groups"
                progressClassName="bg-sky-500"
              />
            </div>
          </div>
        </div>

        {plan.program.editorWorkouts.length > 0 && activeWorkout ? (
          <div className="space-y-4">
            <ProgramWorkoutTabs
              workouts={plan.program.editorWorkouts}
              activeWorkoutId={activeWorkout.id}
              onSelectWorkout={setActiveWorkoutId}
            />

            <ProgramWorkoutCard workout={activeWorkout} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
