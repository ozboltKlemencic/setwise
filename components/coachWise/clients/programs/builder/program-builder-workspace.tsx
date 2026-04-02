"use client"

import * as React from "react"
import { Copy, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"

import { ProgramBuilderDayTabs } from "./program-builder-day-tabs"
import { ProgramBuilderExerciseCard } from "./program-builder-exercise-card"
import { ProgramBuilderSidebar } from "./program-builder-sidebar"

type ProgramBuilderWorkspaceProps = {
  builder: ReturnType<typeof useProgramBuilder>
}

export function ProgramBuilderWorkspace({
  builder,
}: ProgramBuilderWorkspaceProps) {
  return (
    <div className="relative xl:flex xl:items-start">
      <div className="xl:sticky xl:top-[calc(var(--header-height)+3rem)] xl:left-0 xl:h-[calc(100dvh-var(--header-height)-3rem)] xl:w-[360px] xl:flex xl:flex-none xl:flex-col xl:self-start">
        <ProgramBuilderSidebar builder={builder} />
      </div>

      <div className="flex min-h-[calc(100vh-var(--header-height)-3rem)] min-w-0 flex-1 flex-col border-t border-neutral-200 bg-neutral-50">
        <div className="bg-neutral-50">
          <ProgramBuilderDayTabs builder={builder} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {builder.activeDay ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="text-[16px] font-semibold text-neutral-950">
                {builder.activeDay.name}
              </div>
              <div className="text-[12px] text-neutral-500">
                {builder.activeDay.exercises.length} exercises · {builder.totalSets} sets
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={builder.duplicateActiveDay}
                  className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                >
                  <Copy className="mr-1 size-3.5" />
                  Duplicate
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={builder.saveActiveDayAsTemplate}
                  className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                >
                  <Sparkles className="mr-1 size-3.5" />
                  Save template
                </Button>
                {builder.days.length > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.deleteActiveDay}
                    className="h-8 rounded-md border-rose-200 bg-rose-50 px-3 text-[12px] text-rose-600 shadow-none hover:bg-rose-100"
                  >
                    <Trash2 className="mr-1 size-3.5" />
                    Delete
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          {builder.activeDay?.isRest ? (
            <div className="flex min-h-[360px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white text-[14px] text-neutral-500">
              This is a rest day.
            </div>
          ) : builder.activeDay && builder.activeDay.exercises.length > 0 ? (
            <div className="space-y-3">
              {builder.activeDay.exercises.map((entry, index) => (
                <React.Fragment key={entry.uid}>
                  {builder.dragOverIndex === index ? (
                    <div className="flex h-8 items-center justify-center rounded-lg border border-dashed border-brand-300 bg-brand-50/35 text-[12px] font-medium text-brand-600">
                      Drop here
                    </div>
                  ) : null}

                  <div
                    onDragOver={(event) => {
                      event.preventDefault()
                      builder.setDragOverIndex(index)
                    }}
                    onDrop={(event) => {
                      event.preventDefault()
                      builder.handleCanvasDrop(index)
                    }}
                  >
                    <ProgramBuilderExerciseCard builder={builder} entry={entry} index={index} />
                  </div>
                </React.Fragment>
              ))}

              <div
                onDragOver={(event) => {
                  event.preventDefault()
                  builder.setDragOverIndex(builder.activeDay?.exercises.length ?? 0)
                }}
                onDrop={(event) => {
                  event.preventDefault()
                  builder.handleCanvasDrop(builder.activeDay?.exercises.length ?? 0)
                }}
                className={cn(
                  "flex h-10 items-center justify-center rounded-lg border border-dashed text-[12px] font-medium transition-colors",
                  builder.dragOverIndex === (builder.activeDay?.exercises.length ?? 0)
                    ? "border-brand-300 bg-brand-50/35 text-brand-600"
                    : "border-transparent bg-transparent text-transparent"
                )}
              >
                Drop at the end
              </div>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault()
                builder.setDragOverIndex(0)
              }}
              onDrop={(event) => {
                event.preventDefault()
                builder.handleCanvasDrop(0)
              }}
              className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white px-6 text-center"
            >
              <div className="text-[16px] font-semibold text-neutral-900">
                This workout is empty
              </div>
              <div className="mt-2 max-w-md text-[14px] text-neutral-500">
                Search exercises on the left, click to add them, or drag an exercise directly into
                this area.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
