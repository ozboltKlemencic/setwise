"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Copy, Pencil, Trash2 } from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { secondaryActionButtonClassName } from "@/components/coachWise/secondary-action-button"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import {
  FixedProgramEditorDialog,
} from "@/components/coachWise/programs/exercise-history-panel"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StoredProgramPlan, StoredProgramPlanStatus } from "@/types"

export type ProgramPlanStatus = StoredProgramPlanStatus
export type ProgramPlansTableRow = StoredProgramPlan

type ProgramPlansTableProps = {
  rows: ProgramPlansTableRow[]
  emptyMessage?: string
  getDetailRowHref?: (row: ProgramPlansTableRow) => string
  getEditRowHref?: (row: ProgramPlansTableRow) => string
  onDuplicateRow?: (row: ProgramPlansTableRow) => void
  onDeleteRow?: (row: ProgramPlansTableRow) => void
}

const rowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const rowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function getProgramStatusBadgeClassName(status: ProgramPlanStatus) {
  return status === "Active"
    ? "border-emerald-200 bg-linear-to-r from-emerald-50/90 to-emerald-100/65 text-neutral-700"
    : "border-rose-200 bg-linear-to-r from-rose-50/90 to-rose-100/65 text-neutral-700"
}

function ProgramPlansTableComponent({
  rows,
  emptyMessage = "No programs available.",
  getDetailRowHref,
  getEditRowHref,
  onDuplicateRow,
  onDeleteRow,
}: ProgramPlansTableProps) {
  const pathname = usePathname()
  const router = useRouter()

  if (rows.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="px-5 py-10 text-center text-[14px] text-neutral-500">
          {emptyMessage}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(260px,320px)_120px_8.5rem] items-center gap-6 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900">
        <div className="text-left">Program</div>
        <div className="text-left">Workouts</div>
        <div className="text-left">Status</div>
        <div className="justify-self-center text-center">Action</div>
      </div>

      <div>
        {rows.map((row) => {
          const detailHref = getDetailRowHref
            ? buildCoachWiseHref(pathname, getDetailRowHref(row))
            : null
          const editHref = getEditRowHref
            ? buildCoachWiseHref(pathname, getEditRowHref(row))
            : null

          return (
            <div
              key={row.id}
              role={detailHref ? "button" : undefined}
              tabIndex={detailHref ? 0 : undefined}
              onClick={() => {
                if (detailHref) {
                  router.push(detailHref)
                }
              }}
              onKeyDown={(event) => {
                if (!detailHref) {
                  return
                }

                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  router.push(detailHref)
                }
              }}
              className={cn(
                "grid grid-cols-[minmax(0,1fr)_minmax(260px,320px)_120px_8.5rem] items-start gap-6 border-b border-neutral-200 px-5 py-4 last:border-b-0",
                detailHref && "cursor-pointer transition-colors hover:bg-neutral-50"
              )}
            >
              {detailHref ? (
                <div className="min-w-0 pr-6 text-left">
                  <div className="truncate text-[15px] font-medium text-neutral-950">
                    {row.title}
                  </div>
                  <div className="mt-1 truncate text-[14px] text-neutral-500">
                    {row.description}
                  </div>
                </div>
              ) : (
                <FixedProgramEditorDialog
                  program={row.program}
                  trigger={
                    <button
                      type="button"
                      className="min-w-0 pr-6 text-left transition-colors hover:text-brand-700"
                    >
                      <div className="truncate text-[15px] font-medium text-neutral-950">
                        {row.title}
                      </div>
                      <div className="mt-1 truncate text-[14px] text-neutral-500">
                        {row.description}
                      </div>
                    </button>
                  }
                />
              )}

              <div className="flex min-h-10 w-full justify-self-start flex-wrap items-center justify-start gap-2 pt-0.5 text-left">
                {row.workouts.length > 0 ? (
                  row.workouts.map((workout) => (
                    <span
                      key={`${row.id}-${workout}`}
                      className={cn(
                        secondaryActionButtonClassName,
                        "h-auto cursor-default px-2.5 py-1 text-[12px] font-normal text-neutral-600 hover:border-neutral-200/80 hover:bg-neutral-100/85 hover:text-neutral-600"
                      )}
                    >
                      {workout}
                    </span>
                  ))
                ) : (
                  <span
                    className={cn(
                      secondaryActionButtonClassName,
                      "h-auto cursor-default px-2.5 py-1 text-[12px] font-normal text-neutral-600 hover:border-neutral-200/80 hover:bg-neutral-100/85 hover:text-neutral-600"
                    )}
                  >
                    No workouts
                  </span>
                )}
              </div>

              <div className="flex min-h-10 items-center justify-start">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11.5px] font-normal",
                    getProgramStatusBadgeClassName(row.status)
                  )}
                >
                  {row.status}
                </Badge>
              </div>

              <div
                className="flex w-[8.5rem] justify-self-center self-center items-center justify-center gap-2"
                onClick={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={rowActionButtonClassName}
                  onClick={() => onDuplicateRow?.(row)}
                >
                  <Copy className="size-3.5" />
                  <span className="sr-only">Duplicate program</span>
                </Button>

                {editHref ? (
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    size="icon"
                    className={rowActionButtonClassName}
                  >
                    <Link href={editHref}>
                      <Pencil className="size-3.5" />
                      <span className="sr-only">Edit program</span>
                    </Link>
                  </Button>
                ) : (
                  <FixedProgramEditorDialog
                    program={row.program}
                    trigger={
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className={rowActionButtonClassName}
                      >
                        <Pencil className="size-3.5" />
                        <span className="sr-only">Edit program</span>
                      </Button>
                    }
                  />
                )}

                <CoachWiseConfirmationDialog
                  title="Are you sure you want to delete this program?"
                  description={`${row.title} will be removed from the current programs list. This action can't be undone.`}
                  confirmLabel="Delete program"
                  variant="destructive"
                  onConfirm={() => onDeleteRow?.(row)}
                  trigger={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(rowActionButtonClassName, rowDeleteActionButtonClassName)}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="sr-only">Delete program</span>
                    </Button>
                  }
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const ProgramPlansTable = React.memo(ProgramPlansTableComponent)
