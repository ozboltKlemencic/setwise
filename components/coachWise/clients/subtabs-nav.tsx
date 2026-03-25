import type { MouseEventHandler, ReactNode } from "react"
import Link from "next/link"

import {
  PrimaryActionButton,
  primaryActionButtonClassName,
} from "@/components/coachWise/primary-action-button"
import {
  SecondaryActionButton,
  secondaryActionButtonClassName,
} from "@/components/coachWise/secondary-action-button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type SubtabsNavItem = {
  icon?: ReactNode
  label: string
  value: string
  href?: string
}

export type SubtabsNavActionButtonProps = {
  label: string
  icon?: ReactNode
  variant?: "primary" | "secondary"
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

type SubtabsNavProps = {
  items: SubtabsNavItem[]
  actions?: ReactNode
  actionButtons?: SubtabsNavActionButtonProps[]
  className?: string
  tabsListClassName?: string
  triggerClassName?: string
  actionsClassName?: string
}

const subtabsNavTriggerClassName =
  "h-auto h-8 flex-none cursor-pointer gap-1 rounded-none border-0 bg-transparent px-0 py-1 text-[13px] font-normal leading-none text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-brand-600"

const subtabsNavActionButtonBaseClassName =
  "gap-1 px-2.5 text-[13px] font-medium [&_svg]:size-3"

export const subtabsNavActionButtonClassNames = {
  primary: cn(
    primaryActionButtonClassName,
    subtabsNavActionButtonBaseClassName
  ),
  secondary: cn(
    secondaryActionButtonClassName,
    subtabsNavActionButtonBaseClassName
  ),
} as const

function renderActionButtonContent(label: string, icon?: ReactNode) {
  return (
    <>
      {icon ? <span className="flex items-center text-current">{icon}</span> : null}
      <span>{label}</span>
    </>
  )
}

export function SubtabsNavActionButton({
  label,
  icon,
  variant = "secondary",
  href,
  onClick,
  disabled,
  className,
  type = "button",
}: SubtabsNavActionButtonProps) {
  const content = renderActionButtonContent(label, icon)
  const resolvedClassName = cn(subtabsNavActionButtonBaseClassName, className)

  if (variant === "primary") {
    if (href) {
      return (
        <PrimaryActionButton
          href={href}
          label={content}
          className={resolvedClassName}
        />
      )
    }

    return (
      <PrimaryActionButton
        type={type}
        onClick={onClick}
        disabled={disabled}
        label={content}
        className={resolvedClassName}
      />
    )
  }

  if (href) {
    return (
      <SecondaryActionButton
        href={href}
        label={content}
        className={resolvedClassName}
      />
    )
  }

  return (
    <SecondaryActionButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      label={content}
      className={resolvedClassName}
    />
  )
}

export function SubtabsNav({
  items,
  actions,
  actionButtons,
  className,
  tabsListClassName,
  triggerClassName,
  actionsClassName,
}: SubtabsNavProps) {
  const hasItems = items.length > 0
  const hasActions =
    Boolean(actions) || Boolean(actionButtons && actionButtons.length > 0)

  return (
    <div className={cn("border-b border-neutral-200 bg-neutral-50", className)}>
      <div
        className={cn(
          "flex min-h-8 flex-col gap-x-2 gap-y-1 px-4 py-1 lg:flex-row lg:items-center",
          hasItems ? "lg:justify-between" : "lg:justify-end"
        )}
      >
        {hasItems ? (
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <TabsList
              variant="line"
              className={cn(
                "h-auto w-max min-w-max justify-start gap-x-3 rounded-none bg-transparent p-0",
                tabsListClassName
              )}
            >
              {items.map((item) =>
                item.href ? (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={cn(subtabsNavTriggerClassName, triggerClassName)}
                    asChild
                  >
                    <Link href={item.href}>
                      {item.icon ? <span>{item.icon}</span> : null}
                      <span>{item.label}</span>
                    </Link>
                  </TabsTrigger>
                ) : (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className={cn(subtabsNavTriggerClassName, triggerClassName)}
                  >
                    {item.icon ? <span>{item.icon}</span> : null}
                    <span>{item.label}</span>
                  </TabsTrigger>
                )
              )}
            </TabsList>
          </div>
        ) : null}

        {hasActions ? (
          <div className={cn("flex flex-wrap items-center gap-1.5", actionsClassName)}>
            {actionButtons?.map((action) => (
              <SubtabsNavActionButton
                key={`${action.variant ?? "secondary"}-${action.label}`}
                {...action}
              />
            ))}
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
