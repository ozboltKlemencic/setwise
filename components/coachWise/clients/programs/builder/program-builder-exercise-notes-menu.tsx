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
  description?: string | null
}

export const ProgramBuilderExerciseNotesMenu = React.memo(
  function ProgramBuilderExerciseNotesMenu({
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
            <span className="sr-only">Open technical cues</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className={cn(overflowActionsMenuSurfaceClassName, "w-[260px] p-0")}
        >
          <div className="space-y-3 py-3">
            <div className="w-full space-y-1 px-3 border-b border-neutral-200 pb-2">
              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                Technical cues
              </div>
            </div>

            <div className="text-[13px] px-3 leading-5 whitespace-pre-wrap text-neutral-600">
              {description?.trim() || "No technical cues added yet."}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
