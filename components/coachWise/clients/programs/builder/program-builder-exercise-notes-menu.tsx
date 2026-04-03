"use client"

import * as React from "react"
import { NotebookPen } from "lucide-react"

import {
  overflowActionsMenuSurfaceClassName,
  overflowActionsMenuTriggerClassName,
} from "@/components/coachWise/overflow-actions-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProgramBuilderExerciseNotesMenuProps = {
  title: string
  description?: string | null
}

export const ProgramBuilderExerciseNotesMenu = React.memo(
  function ProgramBuilderExerciseNotesMenu({
    title,
    description,
  }: ProgramBuilderExerciseNotesMenuProps) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              overflowActionsMenuTriggerClassName,
              "size-7 rounded-md border-neutral-200/70 bg-neutral-50 text-neutral-500 hover:bg-neutral-100 data-[state=open]:border-neutral-300 data-[state=open]:bg-neutral-100"
            )}
          >
            <NotebookPen className="size-3.5" />
            <span className="sr-only">Open technical cues for {title}</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(overflowActionsMenuSurfaceClassName, "w-[260px] p-0")}
        >
          <div className="space-y-3 p-3">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                Technical cues
              </div>
              <div className="text-[13px] font-semibold text-neutral-950">{title}</div>
            </div>

            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] leading-5 whitespace-pre-wrap text-neutral-600">
              {description?.trim() || "No technical cues added yet."}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
