"use client"

import * as React from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { useProgramBuilder } from "@/hooks/programs/use-program-builder"

type ProgramBuilderDayTabsProps = {
  builder: ReturnType<typeof useProgramBuilder>
}

export const ProgramBuilderDayTabs = React.memo(function ProgramBuilderDayTabs({
  builder,
}: ProgramBuilderDayTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
      {builder.days.map((day, index) => (
        <React.Fragment key={day.id}>
          {builder.dragDayOverIndex === index && builder.draggedDayIndex !== index ? (
            <div className="h-8 w-1 shrink-0 rounded-full bg-brand-500" />
          ) : null}

          <button
            type="button"
            draggable
            onClick={() => builder.setActiveDayIndex(index)}
            onDoubleClick={() => builder.setRenamingDayIndex(index)}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move"
              event.dataTransfer.setData("text/plain", day.id)
              builder.setDraggedDayIndex(index)
            }}
            onDragOver={(event) => {
              event.preventDefault()
              builder.setDragDayOverIndex(index)
            }}
            onDrop={(event) => {
              event.preventDefault()
              builder.handleDayDrop(index)
            }}
            onDragEnd={() => {
              builder.setDraggedDayIndex(null)
              builder.setDragDayOverIndex(null)
            }}
            className={cn(
              "flex h-8 shrink-0 cursor-grab items-center rounded-md border px-4 text-[13px] font-medium transition-colors active:cursor-grabbing",
              index === builder.activeDayIndex
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
              day.isRest && "italic text-neutral-500",
              builder.draggedDayIndex === index && "opacity-40"
            )}
          >
            {builder.renamingDayIndex === index ? (
              <Input
                autoFocus
                value={day.name}
                onChange={(event) => builder.setDayName(index, event.target.value)}
                onBlur={() => builder.setRenamingDayIndex(null)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    builder.setRenamingDayIndex(null)
                  }
                }}
                className="h-6 min-w-[84px] border-0 bg-transparent px-0 text-[13px] font-medium shadow-none focus-visible:ring-0"
              />
            ) : (
              day.name
            )}
          </button>
        </React.Fragment>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={builder.addDay}
        className="h-8 shrink-0 rounded-md border-dashed border-neutral-300 bg-neutral-50 px-3 text-neutral-700 shadow-none hover:border-brand-300 hover:bg-brand-50/35"
      >
        <Plus className="size-3.5" />
        Add workout
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={builder.addRestDay}
        className="h-8 shrink-0 rounded-md border-dashed border-neutral-300 bg-white px-3 text-neutral-600 shadow-none hover:border-neutral-400 hover:bg-neutral-50"
      >
        + Rest
      </Button>
    </div>
  )
})
