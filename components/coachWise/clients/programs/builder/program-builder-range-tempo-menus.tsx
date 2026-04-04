"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"

import { ProgramBuilderToolbarMenu } from "./program-builder-toolbar-menu"

type ProgramBuilderRangeTempoMenusProps = {
  builder: ReturnType<typeof useProgramBuilder>
}

function ProgramBuilderMenuSectionLabel({ label }: { label: string }) {
  return (
    <>
      <div className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </div>
      <div className="border-t border-neutral-200/70" />
    </>
  )
}

export function ProgramBuilderRangeTempoMenus({
  builder,
}: ProgramBuilderRangeTempoMenusProps) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <ProgramBuilderToolbarMenu
        label="Ranges"
        open={builder.showMyReps}
        onOpenChange={(open) => {
          builder.setShowMyReps(open)
          if (open) {
            builder.setShowMyTempos(false)
          }
        }}
      >
        <div className="space-y-3">
          <ProgramBuilderMenuSectionLabel label="Ranges" />
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
      >
        <div className="space-y-3">
          <ProgramBuilderMenuSectionLabel label="Tempo" />
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
  )
}
