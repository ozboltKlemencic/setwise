"use client"

import * as React from "react"

import { secondaryActionButtonClassName } from "@/components/coachWise/secondary-action-button"
import { cn } from "@/lib/utils"

export type ProgramPresetCardData = {
  id: string
  title: string
  description: string
  workouts: string[]
}

type ProgramPresetCardProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string
  description: string
}

export const ProgramPresetCard = React.memo(
  React.forwardRef<HTMLButtonElement, ProgramPresetCardProps>(
    function ProgramPresetCard(
      { title, description, className, type = "button", ...props },
      ref
    ) {
      return (
        <button
          ref={ref}
          type={type}
          className={cn(
            secondaryActionButtonClassName,
            "flex h-auto min-h-20 w-full min-w-0 flex-col items-start justify-start gap-1 overflow-hidden rounded-xl px-4 py-3 text-left",
            "bg-neutral-100/85 hover:border-brand-300/80 hover:bg-brand-50/35 hover:text-neutral-800",
            className
          )}
          {...props}
        >
          <span className="w-full truncate text-[14px] font-medium text-neutral-950">
            {title}
          </span>
          <span className="line-clamp-2 w-full whitespace-normal break-words text-[12px] leading-5 text-neutral-500">
            {description}
          </span>
        </button>
      )
    }
  )
)

ProgramPresetCard.displayName = "ProgramPresetCard"
