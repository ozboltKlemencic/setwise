"use client"

import * as React from "react"
import { NotebookPen } from "lucide-react"

import {
  overflowActionsMenuSurfaceClassName,
  overflowActionsMenuTriggerClassName,
} from "@/components/coachWise/overflow-actions-menu"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ProgramBuilderExerciseNotesMenuProps = {
  description?: string | null
  onAddClue?: (clue: string) => void
  readOnly?: boolean
}

export const ProgramBuilderExerciseNotesMenu = React.memo(
  function ProgramBuilderExerciseNotesMenu({
    description,
    onAddClue,
    readOnly = false,
  }: ProgramBuilderExerciseNotesMenuProps) {
    const [open, setOpen] = React.useState(false)
    const [nextClue, setNextClue] = React.useState("")

    React.useEffect(() => {
      if (open) {
        return
      }

      setNextClue("")
    }, [open])

    const handleAddClue = React.useCallback(() => {
      const trimmedClue = nextClue.trim()
      if (!trimmedClue || !onAddClue || readOnly) {
        return
      }

      onAddClue(trimmedClue)
      setNextClue("")
    }, [nextClue, onAddClue, readOnly])

    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
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
          onCloseAutoFocus={(event) => event.preventDefault()}
          className={cn(overflowActionsMenuSurfaceClassName, "w-[260px] p-0")}
        >
          <div className="py-3">
            <div className="w-full space-y-1 px-3 border-b border-neutral-200 pb-2">
              <div className="text-[11px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                Technical cues
              </div>
            </div>

            <div className="px-3 pt-3 text-[13px] leading-5 whitespace-pre-wrap text-neutral-600">
              {description?.trim() || "No technical cues added yet."}
            </div>

            {!readOnly && onAddClue ? (
              <div className="mt-3 border-t border-neutral-200 px-3 pt-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={nextClue}
                    onChange={(event) => setNextClue(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault()
                        handleAddClue()
                      }
                    }}
                    onPointerDown={(event) => event.stopPropagation()}
                    placeholder="Add another clue"
                    className="h-9 rounded-sm border-neutral-100 bg-neutral-50 text-[13px] shadow-none focus-visible:border-brand-500 focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!nextClue.trim()}
                    onClick={handleAddClue}
                    onPointerDown={(event) => event.stopPropagation()}
                    className="h-9 rounded-sm border-neutral-200 bg-white px-3 text-[13px] text-neutral-700 shadow-none hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)
