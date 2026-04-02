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

type ProgramBuilderWorkspaceProps = {
  initialProgram: FixedProgramEditorProgram
}

export function ProgramBuilderWorkspace({
  initialProgram,
}: ProgramBuilderWorkspaceProps) {
  const builder = useProgramBuilder(initialProgram)

  return (
    <div className="grid min-h-[calc(100vh-var(--header-height)-3rem)] grid-cols-[320px_minmax(0,1fr)] overflow-hidden border-t border-neutral-200 bg-neutral-50">
      <ProgramBuilderSidebar builder={builder} />

      <div className="flex min-h-0 flex-col bg-neutral-50">
        <div className="border-b border-neutral-200 bg-white">
          <div className="px-4 py-4">
            <textarea
              value={builder.description}
              onChange={(event) => builder.setDescription(event.target.value)}
              className="min-h-[76px] w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[14px] text-neutral-700 shadow-none outline-none focus:border-neutral-300"
              placeholder="Build a fixed training program from scratch."
            />
          </div>

          <ProgramBuilderDayTabs builder={builder} />
        </div>

        <div className="border-b border-neutral-200 bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                builder.setShowMyReps(!builder.showMyReps)
                builder.setShowMyTempos(false)
              }}
              className="rounded-md border border-brand-200 bg-brand-50/50 px-3 py-1.5 text-[12px] font-medium text-brand-700"
            >
              Rep ranges
            </button>

            <div className="flex flex-wrap gap-1.5">
              {builder.myReps.map((range, index) => (
                <span
                  key={`${range}-${index}`}
                  className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50/50 px-2 py-0.5 font-mono text-[11px] text-brand-700"
                >
                  {range}
                  {builder.showMyReps ? (
                    <button
                      type="button"
                      onClick={() => builder.removeCustomRepRange(index)}
                      className="text-brand-500"
                    >
                      ×
                    </button>
                  ) : null}
                </span>
              ))}
            </div>

            <div className="mx-1 h-5 w-px bg-neutral-200" />

            <button
              type="button"
              onClick={() => builder.setUseIntensifiers(!builder.useIntensifiers)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[12px] font-medium",
                builder.useIntensifiers
                  ? "border-orange-200 bg-orange-50 text-orange-700"
                  : "border-neutral-200 bg-white text-neutral-500"
              )}
            >
              Intensifiers
            </button>

            <button
              type="button"
              onClick={() => builder.setUseTempo(!builder.useTempo)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-[12px] font-medium",
                builder.useTempo
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-neutral-200 bg-white text-neutral-500"
              )}
            >
              Tempo
            </button>

            {builder.useTempo ? (
              <>
                <div className="mx-1 h-5 w-px bg-neutral-200" />
                <button
                  type="button"
                  onClick={() => {
                    builder.setShowMyTempos(!builder.showMyTempos)
                    builder.setShowMyReps(false)
                  }}
                  className="rounded-md border border-emerald-200 bg-emerald-50/50 px-3 py-1.5 text-[12px] font-medium text-emerald-700"
                >
                  My tempos
                </button>

                <div className="flex flex-wrap gap-1.5">
                  {builder.myTempos.map((tempo, index) => (
                    <span
                      key={`${tempo}-${index}`}
                      className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] text-emerald-700"
                    >
                      {tempo}
                      {builder.showMyTempos ? (
                        <button
                          type="button"
                          onClick={() => builder.removeCustomTempo(index)}
                          className="text-emerald-500"
                        >
                          ×
                        </button>
                      ) : null}
                    </span>
                  ))}
                </div>
              </>
            ) : null}
          </div>

          {builder.showMyReps || builder.showMyTempos ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {builder.showMyReps ? (
                <>
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
                </>
              ) : null}

              {builder.showMyTempos ? (
                <>
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
                </>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {builder.activeDay ? (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <div className="text-[16px] font-semibold text-neutral-950">{builder.activeDay.name}</div>
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
              <div className="text-[16px] font-semibold text-neutral-900">This workout is empty</div>
              <div className="mt-2 max-w-md text-[14px] text-neutral-500">
                Search exercises on the left, click to add them, or drag an exercise directly into this area.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
