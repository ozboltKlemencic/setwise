"use client"

import * as React from "react"
import Link from "next/link"

import { secondaryActionButtonClassName } from "@/components/coachWise/secondary-action-button"
import { cn } from "@/lib/utils"

export type ProgramPresetCardData = {
  id: string
  title: string
  description: string
  workouts: string[]
}

type ProgramPresetCardBaseProps = {
  title: string
  description: string
  className?: string
}

type ProgramPresetCardLinkProps = ProgramPresetCardBaseProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className"> & {
    href: string
    onClick?: never
  }

type ProgramPresetCardButtonProps = ProgramPresetCardBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never
  }

type ProgramPresetCardProps = ProgramPresetCardLinkProps | ProgramPresetCardButtonProps

export const ProgramPresetCard = React.memo(
  React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ProgramPresetCardProps>(
    function ProgramPresetCard(allProps, ref) {
      const { title, description, className } = allProps
      const sharedClassName = cn(
        secondaryActionButtonClassName,
        "flex h-auto min-h-20 w-full min-w-0 flex-col items-start justify-start gap-1 overflow-hidden rounded-xl px-4 py-3 text-left",
        "bg-neutral-100/85 hover:border-brand-300/80 hover:bg-brand-50/35 hover:text-neutral-800",
        className
      )

      const content = (
        <>
          <span className="w-full truncate text-[14px] font-medium text-neutral-950">
            {title}
          </span>
          <span className="line-clamp-2 w-full whitespace-normal break-words text-[12px] leading-5 text-neutral-500">
            {description}
          </span>
        </>
      )

      if ("href" in allProps && typeof allProps.href === "string") {
        const {
          href,
          title: _title,
          description: _description,
          className: _className,
          ...linkProps
        } = allProps

        return (
          <Link
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            className={sharedClassName}
            {...linkProps}
          >
            {content}
          </Link>
        )
      }

      const {
          type = "button",
          title: _title,
          description: _description,
          className: _className,
          ...buttonProps
        } = allProps

      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          className={sharedClassName}
          {...buttonProps}
        >
          {content}
        </button>
      )
    }
  )
)

ProgramPresetCard.displayName = "ProgramPresetCard"
