"use client"

import * as React from "react"
import { RefreshCw, Trash2 } from "lucide-react"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { cn } from "@/lib/utils"
import type { ProgramBuilderDayTemplate } from "@/types"

type ProgramBuilderTemplateCardProps = {
  template: ProgramBuilderDayTemplate
  onApply: () => void
  onReplace: () => void
  onDelete: () => void
  className?: string
}

export const ProgramBuilderTemplateCard = React.memo(function ProgramBuilderTemplateCard({
  template,
  onApply,
  onReplace,
  onDelete,
  className,
}: ProgramBuilderTemplateCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-3 shadow-[0_1px_2px_rgba(17,24,39,0.04)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-neutral-950">
            {template.name}
          </div>
        </div>

        <CoachWiseConfirmationDialog
          title="Delete this template?"
          description={`${template.name} will be removed from saved templates. This action can't be undone.`}
          confirmLabel="Delete template"
          variant="destructive"
          onConfirm={onDelete}
          trigger={
            <button
              type="button"
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-500 shadow-none transition-colors hover:bg-rose-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          }
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {template.exercises.map((exercise) => (
          <span
            key={`${template.id}-${exercise.uid}`}
            className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-600"
          >
            {exercise.name}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        <SecondaryActionButton
          label="Add exercises"
          onClick={onApply}
          className="h-9 w-full justify-center rounded-lg border-neutral-200 bg-neutral-50 text-[13px] text-neutral-700 hover:bg-neutral-100"
        />
        <SecondaryActionButton
          label="Replace"
          icon={RefreshCw}
          onClick={onReplace}
          className="h-9 w-full justify-center rounded-lg border-brand-300 bg-brand-50/35 text-[13px] text-brand-700 hover:border-brand-400 hover:bg-brand-50/50"
        />
      </div>
    </div>
  )
})
