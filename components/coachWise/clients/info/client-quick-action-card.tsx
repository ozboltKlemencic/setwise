import * as React from "react"
import type { ReactNode } from "react"
import { IconPlus } from "@tabler/icons-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

export type ClientQuickActionTone =
  | "programs"
  | "nutrition"
  | "supplements"
  | "checkins"
  | "habits"

type ClientQuickActionCardBaseProps = {
  icon: ReactNode
  sectionLabel: string
  title: string
  description: string
  tone: ClientQuickActionTone
  size?: "default" | "compact"
  className?: string
}

type ClientQuickActionCardLinkProps = ClientQuickActionCardBaseProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "children" | "className"> & {
    href: string
    onClick?: never
    type?: never
  }

type ClientQuickActionCardButtonProps = ClientQuickActionCardBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: never
  }

export type ClientQuickActionCardProps =
  | ClientQuickActionCardLinkProps
  | ClientQuickActionCardButtonProps

const quickActionCardToneStyles: Record<
  ClientQuickActionTone,
  {
    container: string
    badge: string
    watermark: string
  }
> = {
  programs: {
    container:
      "border-sky-200/80 bg-linear-to-br from-sky-50/45 to-white hover:border-sky-300 hover:bg-sky-50/60",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    watermark: "text-sky-500/12",
  },
  nutrition: {
    container:
      "border-emerald-200/80 bg-linear-to-br from-emerald-50/45 to-white hover:border-emerald-300 hover:bg-emerald-50/60",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    watermark: "text-emerald-500/12",
  },
  supplements: {
    container:
      "border-violet-200/80 bg-linear-to-br from-violet-50/45 to-white hover:border-violet-300 hover:bg-violet-50/60",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    watermark: "text-violet-500/12",
  },
  checkins: {
    container:
      "border-amber-200/80 bg-linear-to-br from-amber-50/45 to-white hover:border-amber-300 hover:bg-amber-50/60",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    watermark: "text-amber-500/12",
  },
  habits: {
    container:
      "border-rose-200/80 bg-linear-to-br from-rose-50/45 to-white hover:border-rose-300 hover:bg-rose-50/60",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    watermark: "text-rose-500/12",
  },
}

function isLinkProps(
  props: ClientQuickActionCardProps
): props is ClientQuickActionCardLinkProps {
  return "href" in props && typeof props.href === "string"
}

export function ClientQuickActionCard(props: ClientQuickActionCardProps) {
  const {
    icon,
    sectionLabel,
    title,
    description,
    tone,
    size = "default",
    className,
  } = props
  const toneStyles = quickActionCardToneStyles[tone]
  const isCompact = size === "compact"
  const content = (
    <>
      <span
        className={cn(
          isCompact
            ? "pointer-events-none absolute right-3.5 top-3.5 [&_svg]:size-12"
            : "pointer-events-none absolute right-4 top-4 [&_svg]:size-16",
          toneStyles.watermark
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          isCompact
            ? "mb-3 flex size-10 items-center justify-center rounded-xl border transition-colors"
            : "mb-4 flex size-12 items-center justify-center rounded-2xl border transition-colors",
          toneStyles.badge
        )}
      >
        <IconPlus className={cn(isCompact ? "size-4.5" : "size-5")} />
      </span>
      <span
        className={cn(
          isCompact
            ? "mb-1 text-[9px] font-medium tracking-[0.12em] text-neutral-400 uppercase"
            : "mb-1.5 text-[10px] font-medium tracking-[0.1em] text-neutral-400 uppercase"
        )}
      >
        {sectionLabel}
      </span>
      <span
        className={cn(
          isCompact
            ? "text-[16px] font-semibold tracking-[-0.02em] text-neutral-950"
            : "text-[20px] font-semibold tracking-[-0.02em] text-neutral-950"
        )}
      >
        {title}
      </span>
      <span
        className={cn(
          isCompact
            ? "mt-1.5 max-w-[16rem] text-[12px] leading-4.5 text-neutral-500"
            : "mt-2 max-w-[19rem] text-[13px] leading-5 text-neutral-500"
        )}
      >
        {description}
      </span>
    </>
  )
  const sharedClassName = cn(
    isCompact
      ? "group relative flex min-h-32 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white px-4 py-4 text-center shadow-none transition-colors hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
      : "group relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border bg-white px-5 py-6 text-center shadow-none transition-colors hover:shadow-none disabled:cursor-not-allowed disabled:opacity-60",
    toneStyles.container,
    className
  )

  if (isLinkProps(props)) {
    const {
      href,
      icon: _icon,
      sectionLabel: _sectionLabel,
      title: _title,
      description: _description,
      tone: _tone,
      size: _size,
      className: _className,
      ...linkProps
    } = props

    return (
      <Link href={href} className={sharedClassName} {...linkProps}>
        {content}
      </Link>
    )
  }

  const {
    type = "button",
    icon: _icon,
    sectionLabel: _sectionLabel,
    title: _title,
    description: _description,
    tone: _tone,
    size: _size,
    className: _className,
    ...restButtonProps
  } = props

  return (
    <button type={type} className={sharedClassName} {...restButtonProps}>
      {content}
    </button>
  )
}
