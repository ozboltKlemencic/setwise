"use client"

import * as React from "react"
import { Copy, Plus, Sparkles, Trash2 } from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { OverflowActionsMenu } from "@/components/coachWise/overflow-actions-menu"
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
  const deleteDayTriggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({})

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
      {builder.days.map((day, index) => (
        <React.Fragment key={day.id}>
          {builder.dragDayOverIndex === index && builder.draggedDayIndex !== index ? (
            <div className="h-8 w-1 shrink-0 rounded-full bg-brand-500" />
          ) : null}

          <div
            draggable
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
              "relative flex h-8 shrink-0 cursor-grab items-center rounded-sm border pr-8 pl-4 text-[13px] transition-colors active:cursor-grabbing",
              index === builder.activeDayIndex
                ? "border-brand-300 bg-brand-50 text-brand-700"
                : "border-neutral-200/80 bg-neutral-100/85 font-normal text-neutral-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] hover:border-neutral-300/80 hover:bg-neutral-200/55 hover:text-neutral-800",
              day.isRest && "italic text-neutral-500",
              builder.draggedDayIndex === index && "opacity-40"
            )}
          >
            <button
              type="button"
              onClick={() => builder.setActiveDayIndex(index)}
              onDoubleClick={() => builder.setRenamingDayIndex(index)}
              className="min-w-0 truncate text-left"
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
                  onClick={(event) => event.stopPropagation()}
                  className="h-5! min-w-[84px] border-0 bg-transparent px-0 text-[13px] font-medium shadow-none focus-visible:ring-0"
                />
              ) : (
                day.name
              )}
            </button>

            {builder.renamingDayIndex !== index ? (
              <>
                <OverflowActionsMenu
                  triggerLabel={`Open actions for ${day.name}`}
                  items={[
                    {
                      id: "duplicate",
                      label: "Duplicate workout",
                      icon: Copy,
                      onSelect: () => builder.duplicateDay(index),
                    },
                    {
                      id: "template",
                      label: "Save as template",
                      icon: Sparkles,
                      disabled: day.isRest || day.exercises.length === 0,
                      onSelect: () => {
                        if (day.isRest || day.exercises.length === 0) {
                          return
                        }
                        builder.saveDayAsTemplate(index)
                      },
                    },
                    {
                      id: "delete",
                      label: "Delete workout",
                      icon: Trash2,
                      variant: "destructive",
                      disabled: builder.days.length <= 1,
                      onSelect: () => {
                        if (builder.days.length <= 1) {
                          return
                        }
                        deleteDayTriggerRefs.current[day.id]?.click()
                      },
                    },
                  ]}
                  triggerClassName="absolute top-1/2 right-1 z-10 -translate-y-1/2 cursor-pointer border-transparent bg-transparent opacity-100 shadow-none hover:border-transparent hover:bg-transparent hover:text-foreground data-[state=open]:border-transparent data-[state=open]:bg-transparent data-[state=open]:opacity-100"
                />

                <CoachWiseConfirmationDialog
                  title="Delete this workout?"
                  description={`${day.name} will be removed from this program. This action can't be undone.`}
                  confirmLabel="Delete workout"
                  variant="destructive"
                  onConfirm={() => builder.deleteDay(index)}
                  trigger={
                    <button
                      ref={(node) => {
                        deleteDayTriggerRefs.current[day.id] = node
                      }}
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="sr-only"
                    />
                  }
                />
              </>
            ) : null}
          </div>
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
