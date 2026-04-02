"use client"

import * as React from "react"
import { GripVertical, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PROGRAM_BUILDER_MUSCLE_CLASSES } from "@/lib/programs/program-builder-data"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"

type ProgramBuilderSidebarProps = {
  builder: ReturnType<typeof useProgramBuilder>
}

export const ProgramBuilderSidebar = React.memo(function ProgramBuilderSidebar({
  builder,
}: ProgramBuilderSidebarProps) {
  return (
    <div className="flex min-h-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-3 pt-3">
        <div className="grid grid-cols-2 gap-2">
          {(["exercises", "templates"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => builder.setLeftTab(tab)}
              className={cn(
                "rounded-md border px-3 py-2 text-[12px] font-medium capitalize transition-colors",
                builder.leftTab === tab
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative my-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={builder.leftTab === "exercises" ? builder.searchQuery : builder.templateQuery}
            onChange={(event) =>
              builder.leftTab === "exercises"
                ? builder.setSearchQuery(event.target.value)
                : builder.setTemplateQuery(event.target.value)
            }
            placeholder={
              builder.leftTab === "exercises" ? "Search exercises..." : "Search templates..."
            }
            className="h-10 rounded-md border-neutral-200 bg-white pl-9 shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
          />
        </div>

        {builder.leftTab === "exercises" ? (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {builder.muscleFilters.map((muscle) => (
              <button
                key={muscle}
                type="button"
                onClick={() => builder.setMuscleFilter(muscle)}
                className={cn(
                  "rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  builder.muscleFilter === muscle
                    ? muscle === "All"
                      ? "border-neutral-300 bg-neutral-100 text-neutral-800"
                      : PROGRAM_BUILDER_MUSCLE_CLASSES[muscle]
                    : "border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
                )}
              >
                {muscle}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
        {builder.leftTab === "exercises" ? (
          <div className="space-y-2">
            {builder.filteredExercises.map((exercise) => (
              <div
                key={exercise.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = "copy"
                  event.dataTransfer.setData("text/plain", String(exercise.id))
                  builder.setDraggedLibraryExercise(exercise)
                }}
                onDragEnd={() => builder.setDraggedLibraryExercise(null)}
                className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white py-3 pr-3 pl-2 transition-colors hover:border-brand-400 hover:bg-brand-50/35"
              >
                <div
                  className={cn(
                    "flex size-8 shrink-0 cursor-grab items-center justify-center rounded-lg border active:cursor-grabbing",
                    PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle]
                  )}
                >
                  <GripVertical className="size-3.5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-neutral-950">
                    {exercise.name}
                  </div>
                  <div className="mt-0.5 text-[11px] text-neutral-500">
                    {exercise.muscle.replace("_", " ")}
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => builder.addExercise(exercise)}
                  disabled={!builder.activeDay || builder.activeDay.isRest || builder.dayExerciseIds.has(exercise.id)}
                  className="size-7 rounded-md border-neutral-200 bg-neutral-50 text-neutral-700 shadow-none hover:bg-neutral-100"
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {builder.filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]"
              >
                <div className="text-[13px] font-semibold text-neutral-950">{template.name}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {template.exercises.map((exercise) => (
                    <span
                      key={`${template.id}-${exercise.uid}`}
                      className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600"
                    >
                      {exercise.name}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => builder.applyTemplate(template)}
                    className="h-8 flex-1 rounded-md border-neutral-200 bg-white text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add exercises
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => builder.replaceWithTemplate(template)}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-600 shadow-none hover:bg-neutral-50"
                  >
                    Replace
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => builder.removeTemplate(template.id)}
                    className="h-8 rounded-md border-rose-200 bg-rose-50 px-2.5 text-[12px] text-rose-600 shadow-none hover:bg-rose-100"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {builder.filteredTemplates.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-[13px] text-neutral-500">
                No templates found.
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
})
