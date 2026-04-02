"use client"

import * as React from "react"
import { Copy, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProgramBuilder } from "@/hooks/programs/use-program-builder"
import { cn } from "@/lib/utils"
import type { FixedProgramEditorProgram } from "@/types"

import { ProgramBuilderDayTabs } from "./program-builder-day-tabs"
import { ProgramBuilderExerciseCard } from "./program-builder-exercise-card"
import { ProgramBuilderSidebar } from "./program-builder-sidebar"
import { ProgramBuilderToolbarMenu } from "./program-builder-toolbar-menu"

type ProgramBuilderWorkspaceProps = {
  initialProgram: FixedProgramEditorProgram
}

export function ProgramBuilderWorkspace({
  initialProgram,
}: ProgramBuilderWorkspaceProps) {
  const builder = useProgramBuilder(initialProgram)

  return (
    <div className="relative xl:flex xl:items-start">
      <div className="xl:sticky xl:top-[calc(var(--header-height)+3rem)] xl:left-0 xl:h-[calc(100dvh-var(--header-height)-3rem)] xl:w-[360px] xl:flex xl:flex-none xl:flex-col xl:self-start">
        <ProgramBuilderSidebar builder={builder} />
      </div>

      <div className="flex min-h-[calc(100vh-var(--header-height)-3rem)] min-w-0 flex-1 flex-col border-t border-neutral-200 bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <ProgramBuilderDayTabs builder={builder} />
        </div>

        <div className="border-b border-neutral-200 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <ProgramBuilderToolbarMenu
              label="Rep ranges"
              open={builder.showMyReps}
              onOpenChange={(open) => {
                builder.setShowMyReps(open)
                if (open) {
                  builder.setShowMyTempos(false)
                }
              }}
              triggerClassName="border-brand-200 bg-brand-50/70 text-brand-700 hover:border-brand-300 hover:bg-brand-50/90 data-[state=open]:border-brand-300 data-[state=open]:bg-brand-50"
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Rep ranges
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myReps.map((range, index) => (
                    <div
                      key={`${range}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{range}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomRepRange(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newRepRange}
                    onChange={(event) => builder.setNewRepRange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomRepRange()
                      }
                    }}
                    placeholder="e.g. 5-8"
                    className="h-8 w-24 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomRepRange}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add range
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>

            <ProgramBuilderToolbarMenu
              label="Tempo"
              open={builder.showMyTempos}
              onOpenChange={(open) => {
                builder.setShowMyTempos(open)
                if (open) {
                  builder.setShowMyReps(false)
                }
              }}
              triggerClassName="border-emerald-200 bg-emerald-50/70 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50/90 data-[state=open]:border-emerald-300 data-[state=open]:bg-emerald-50"
            >
              <div className="space-y-3">
                <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                  Tempo
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="max-h-64 space-y-1 overflow-y-auto px-1.5">
                  {builder.myTempos.map((tempo, index) => (
                    <div
                      key={`${tempo}-${index}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <span className="font-mono text-[12px]">{tempo}</span>
                      <button
                        type="button"
                        onClick={() => builder.removeCustomTempo(index)}
                        className="text-[12px] text-neutral-400 transition-colors hover:text-neutral-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-200/70" />
                <div className="flex items-center gap-2 px-1.5 pb-1.5">
                  <Input
                    value={builder.newTempo}
                    onChange={(event) => builder.setNewTempo(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        builder.addCustomTempo()
                      }
                    }}
                    placeholder="e.g. 3-1-2-0"
                    className="h-8 w-28 rounded-md border-neutral-200 bg-white font-mono text-[12px] shadow-none focus-visible:border-neutral-300 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={builder.addCustomTempo}
                    className="h-8 rounded-md border-neutral-200 bg-white px-3 text-[12px] text-neutral-700 shadow-none hover:bg-neutral-50"
                  >
                    Add tempo
                  </Button>
                </div>
              </div>
            </ProgramBuilderToolbarMenu>
          </div>
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
