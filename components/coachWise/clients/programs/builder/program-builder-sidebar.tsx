"use client"

import * as React from "react"
import { Bookmark, Dumbbell, GripVertical, Plus, Search } from "lucide-react"

import { PrimaryActionButton } from "@/components/coachWise/primary-action-button"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { PROGRAM_BUILDER_MUSCLE_CLASSES } from "@/lib/programs/program-builder-data"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"

import { ProgramBuilderCreateExerciseDialog } from "./program-builder-create-exercise-dialog"
import { ProgramBuilderTemplateCard } from "./program-builder-template-card"

type ProgramBuilderSidebarProps = {
  builder: ReturnType<typeof useProgramBuilder>
}

export const ProgramBuilderSidebar = React.memo(function ProgramBuilderSidebar({
  builder,
}: ProgramBuilderSidebarProps) {
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = React.useState(false)
  const [showSaveTemplateForm, setShowSaveTemplateForm] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState("")
  const [templatedDayIds, setTemplatedDayIds] = React.useState<Set<string>>(() => new Set())
  const sidebarTabs = React.useMemo(
    () => [
      {
        id: "exercises" as const,
        label: "Exercises",
        icon: Dumbbell,
      },
      {
        id: "templates" as const,
        label: "Templates",
        icon: Bookmark,
      },
    ],
    []
  )
  const showExerciseEmptyState =
    builder.leftTab === "exercises" &&
    builder.searchQuery.trim().length > 0 &&
    builder.filteredExercises.length === 0
  const activeDayCanBeTemplated = Boolean(
    builder.activeDay &&
    !builder.activeDay.isRest &&
    builder.activeDay.exercises.length > 0 &&
    !templatedDayIds.has(builder.activeDay.id)
  )

  React.useEffect(() => {
    setShowSaveTemplateForm(false)
    setNewTemplateName("")
  }, [builder.activeDay?.id, builder.leftTab])

  const handleOpenSaveTemplateForm = React.useCallback(() => {
    if (!builder.activeDay) {
      return
    }

    setShowSaveTemplateForm(true)
    setNewTemplateName(builder.activeDay.name)
  }, [builder.activeDay])

  const handleSaveActiveTemplate = React.useCallback(() => {
    const activeDay = builder.activeDay
    if (!activeDay) {
      return
    }

    builder.saveActiveDayAsTemplate(newTemplateName)
    setTemplatedDayIds((currentIds) => new Set(currentIds).add(activeDay.id))
    setShowSaveTemplateForm(false)
    setNewTemplateName("")
  }, [builder, newTemplateName])

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden border-r border-neutral-200 bg-neutral-50">
      <ProgramBuilderCreateExerciseDialog
        open={isCreateExerciseOpen}
        onOpenChange={setIsCreateExerciseOpen}
        initialName={builder.searchQuery.trim()}
        onCreate={builder.createExercise}
      />

      <div className="border-b border-neutral-200 bg-neutral-50 px-2">
        <div className="grid grid-cols-2 gap-1.5">
          {sidebarTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = builder.leftTab === tab.id

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => builder.setLeftTab(tab.id)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 border-b-2 border-transparent bg-transparent px-3 py-2.5 text-[13px] transition-colors",
                  isActive
                    ? "border-brand-500 font-medium text-neutral-950"
                    : "text-neutral-500 hover:text-neutral-800"
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 transition-colors",
                    isActive ? "text-brand-600" : "text-neutral-400"
                  )}
                />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-neutral-50 px-4 py-3">
        {builder.leftTab === "exercises" ? (
          <>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                value={builder.searchQuery}
                onChange={(event) => builder.setSearchQuery(event.target.value)}
                placeholder="Search exercises..."
                className="h-10 rounded-sm border-neutral-200 bg-neutral-50 pl-9 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
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

            <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-2 [scrollbar-color:var(--color-neutral-100)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1 xl:-mr-2 xl:[overflow-y:overlay] xl:pr-2">
                {showExerciseEmptyState ? (
                  <div className="space-y-3">
                    <div className="text-[11px] font-semibold tracking-[0.14em] text-neutral-400 uppercase">
                      Search results
                    </div>

                    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-100 px-4 py-8 text-center text-[13px] text-neutral-500">
                      No exercises found.
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCreateExerciseOpen(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-brand-400 bg-brand-50/35 px-4 py-2 text-[14px] font-normal text-brand-700 transition-colors hover:bg-brand-50/50"
                    >
                      <Plus className="size-3" />
                      <span>Create &quot;{builder.searchQuery.trim()}&quot;</span>
                    </button>
                  </div>
                ) : (
                  builder.filteredExercises.map((exercise) => {
                    const isAddedToDay = builder.dayExerciseIds.has(exercise.id)
                    const isDisabled =
                      !builder.activeDay || builder.activeDay.isRest || isAddedToDay

                    return (
                      <div
                        key={exercise.id}
                        draggable={!isDisabled}
                        onDragStart={(event) => {
                          if (isDisabled) {
                            event.preventDefault()
                            return
                          }

                          event.dataTransfer.effectAllowed = "copy"
                          event.dataTransfer.setData("text/plain", String(exercise.id))
                          builder.setDraggedLibraryExercise(exercise)
                        }}
                        onDragEnd={() => builder.setDraggedLibraryExercise(null)}
                        className={cn(
                          "flex items-center gap-2 rounded-md border py-3 pr-3 pl-2 transition-colors",
                          isDisabled && "cursor-not-allowed",
                          isAddedToDay
                            ? "border-neutral-200 bg-neutral-50 text-neutral-500"
                            : "border-neutral-200 bg-white hover:border-brand-400 hover:bg-brand-50/35"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                            PROGRAM_BUILDER_MUSCLE_CLASSES[exercise.muscle],
                            isAddedToDay
                              ? "cursor-not-allowed opacity-55"
                              : "cursor-grab active:cursor-grabbing"
                          )}
                        >
                          <GripVertical className="size-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div
                            className={cn(
                              "truncate text-[13px] font-medium",
                              isAddedToDay ? "text-neutral-700" : "text-neutral-950"
                            )}
                          >
                            {exercise.name}
                          </div>
                          <div
                            className={cn(
                              "mt-0.5 text-[11px]",
                              isAddedToDay ? "text-neutral-400" : "text-neutral-500"
                            )}
                          >
                            {exercise.muscle.replace("_", " ")}
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() => builder.addExercise(exercise)}
                          disabled={isDisabled}
                          className="size-7 rounded-md border-neutral-200/70 bg-neutral-50 text-neutral-700 shadow-none hover:bg-neutral-100 disabled:cursor-not-allowed"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="shrink-0 pb-3">
              {showSaveTemplateForm ? (
                <div className="mb-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 shadow-lg shadow-neutral-900/5">
                  <div className="space-y-3">
                    <div className="text-[13px] font-medium text-neutral-900">
                      Save current workout as template
                    </div>
                    <Input
                      value={newTemplateName}
                      onChange={(event) => setNewTemplateName(event.target.value)}
                      placeholder={`${builder.activeDay?.name ?? "Workout"} template`}
                      className="h-9 rounded-sm border-neutral-200 bg-neutral-100 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <SecondaryActionButton
                        label="Cancel"
                        onClick={() => {
                          setShowSaveTemplateForm(false)
                          setNewTemplateName("")
                        }}
                      />
                      <PrimaryActionButton
                        label="Save template"
                        onClick={handleSaveActiveTemplate}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {activeDayCanBeTemplated && !showSaveTemplateForm ? (
                <SecondaryActionButton
                  label={`Create "${builder.activeDay?.name}" template`}
                  onClick={handleOpenSaveTemplateForm}
                  className="mb-3 w-full justify-center"
                />
              ) : null}

              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400" />
                <Input
                  value={builder.templateQuery}
                  onChange={(event) => builder.setTemplateQuery(event.target.value)}
                  placeholder="Search templates..."
                  className="h-10 rounded-sm border-neutral-200 bg-neutral-50 pl-9 shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2 [scrollbar-color:var(--color-neutral-100)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-100 [&::-webkit-scrollbar-thumb:hover]:bg-neutral-200 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1 xl:-mr-2 xl:[overflow-y:overlay] xl:pr-2">
              {builder.filteredTemplates.map((template) => (
                <ProgramBuilderTemplateCard
                  key={template.id}
                  template={template}
                  onApply={() => builder.applyTemplate(template)}
                  onReplace={() => builder.replaceWithTemplate(template)}
                  onDelete={() => builder.removeTemplate(template.id)}
                />
              ))}

              {builder.filteredTemplates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-100/70 px-4 py-8 text-center text-[13px] text-neutral-500">
                  No templates found.
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
