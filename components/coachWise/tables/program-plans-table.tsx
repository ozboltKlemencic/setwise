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
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { StoredProgramPlan } from "@/types"

export type ProgramPlansTableRow = StoredProgramPlan & {
  storageScopeId?: string
  clients?: Array<{
    id: string
    name: string
    avatar?: string
  }>
}

type ProgramPlansTableProps = {
  rows: ProgramPlansTableRow[]
  emptyMessage?: string
  showClientColumn?: boolean
  getDetailRowHref?: (row: ProgramPlansTableRow) => string
  getEditRowHref?: (row: ProgramPlansTableRow) => string
  onDuplicateRow?: (row: ProgramPlansTableRow) => void
  onDeleteRow?: (row: ProgramPlansTableRow) => void
}

const rowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const rowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function ProgramPlanClientsCell({
  clients,
}: {
  clients: NonNullable<ProgramPlansTableRow["clients"]>
}) {
  const visibleClients = clients.slice(0, 3)
  const remainingClients = clients.length - visibleClients.length
  const primaryClient = clients[0]
  const clientLabel =
    clients.length > 1
      ? `${primaryClient.name} +${clients.length - 1} others`
      : primaryClient.name

  return (
    <div className="flex items-center gap-3">
      <AvatarGroup className="shrink-0">
        {visibleClients.map((client) => (
          <Avatar key={client.id} size="sm" className="ring-neutral-50">
            <AvatarImage src={client.avatar} alt={client.name} />
            <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
              {getInitials(client.name)}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingClients > 0 ? (
          <AvatarGroupCount className="size-6 bg-neutral-100 text-[11px] text-neutral-600 ring-neutral-50">
            +{remainingClients}
          </AvatarGroupCount>
        ) : null}
      </AvatarGroup>

      <div className="min-w-0 text-[13px] text-neutral-700">
        <span className="truncate">{clientLabel}</span>
      </div>
    </div>
  )
}

function ProgramPlansTableComponent({
  rows,
  emptyMessage = "No programs available.",
  showClientColumn = false,
  getDetailRowHref,
  getEditRowHref,
  onDuplicateRow,
  onDeleteRow,
}: ProgramPlansTableProps) {
  const pathname = usePathname()
  const router = useRouter()
  const hasClientColumn = showClientColumn || rows.some((row) => row.clients?.length)
  const headerGridClassName = hasClientColumn
    ? "grid-cols-[minmax(0,1fr)_minmax(250px,280px)_minmax(260px,320px)_8.5rem]"
    : "grid-cols-[minmax(0,1fr)_minmax(260px,320px)_8.5rem]"

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
      <div
        className={cn(
          "grid items-center gap-6 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-[13px] font-medium text-neutral-900",
          headerGridClassName
        )}
      >
        <div className="text-left">Program</div>
        {hasClientColumn ? <div className="text-left">Client</div> : null}
        <div className="text-left">Workouts</div>
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
              key={`${row.storageScopeId ?? "global"}:${row.id}`}
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
                "grid items-start gap-6 border-b border-neutral-200 px-5 py-3 last:border-b-0",
                headerGridClassName,
                detailHref && "cursor-pointer transition-colors hover:bg-neutral-50"
              )}
            >
              {detailHref ? (
                <div className="min-w-0 max-w-[28rem] pr-6 text-left">
                  <div className="truncate text-[15px] font-medium text-neutral-950">
                    {row.title}
                  </div>
                  <div className="mt-0.5 truncate text-[14px] text-neutral-500">
                    {row.description}
                  </div>
                </div>
              ) : (
                <FixedProgramEditorDialog
                  program={row.program}
                  trigger={
                    <button
                      type="button"
                      className="min-w-0 max-w-[28rem] pr-6 text-left transition-colors hover:text-brand-700"
                    >
                      <div className="truncate text-[15px] font-medium text-neutral-950">
                        {row.title}
                      </div>
                      <div className="mt-0.5 truncate text-[14px] text-neutral-500">
                        {row.description}
                      </div>
                    </button>
                  }
                />
              )}

              {hasClientColumn ? (
                <div className="flex min-h-10 items-center justify-start">
                  {row.clients?.length ? (
                    <ProgramPlanClientsCell clients={row.clients} />
                  ) : (
                    <span className="text-[13px] text-neutral-400">-</span>
                  )}
                </div>
              ) : null}

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
