import type { MouseEventHandler, ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export type ClientSubtabsNavItem = {
  icon?: ReactNode
  label: string
  value: string
  href?: string
}

export type ClientSubtabsNavActionButtonProps = {
  label: string
  icon?: ReactNode
  variant?: "primary" | "secondary"
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

type ClientSubtabsNavProps = {
  items: ClientSubtabsNavItem[]
  actions?: ReactNode
  actionButtons?: ClientSubtabsNavActionButtonProps[]
  className?: string
  tabsListClassName?: string
  triggerClassName?: string
  actionsClassName?: string
}

const clientSubtabsNavTriggerClassName =
  "h-auto min-h-8 flex-none cursor-pointer gap-1 rounded-none border-0 bg-transparent px-0 py-1 text-[12px] font-normal leading-none text-neutral-500 shadow-none after:hidden hover:text-neutral-700 data-[state=active]:bg-transparent data-[state=active]:text-neutral-900 data-[state=active]:shadow-none [&_svg]:size-3 [&_svg]:text-neutral-400 data-[state=active]:[&_svg]:text-brand-600"

const clientSubtabsNavActionButtonBaseClassName =
  "h-8 cursor-pointer gap-1 px-2.5 text-[12px] font-medium [&_svg]:size-3"

export const clientSubtabsNavActionButtonClassNames = {
  primary:
    `${clientSubtabsNavActionButtonBaseClassName} border-transparent bg-linear-to-r from-brand-500 to-brand-600 text-white shadow-none hover:from-brand-600 hover:to-brand-700`,
  secondary:
    `${clientSubtabsNavActionButtonBaseClassName} rounded-sm border-neutral-200 bg-white text-neutral-700 shadow-none hover:bg-neutral-50 hover:text-neutral-900`,
} as const

export function ClientSubtabsNavActionButton({
  label,
  icon,
  variant = "secondary",
  href,
  onClick,
  disabled,
  className,
  type = "button",
}: ClientSubtabsNavActionButtonProps) {
  const resolvedClassName = cn(
    clientSubtabsNavActionButtonClassNames[variant],
    className
  )

  if (href) {
    return (
      <Button
        asChild
        size="sm"
        variant={variant === "secondary" ? "outline" : "default"}
        className={resolvedClassName}
      >
        <Link href={href}>
          {icon}
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type={type}
      size="sm"
      variant={variant === "secondary" ? "outline" : "default"}
      onClick={onClick}
      disabled={disabled}
      className={resolvedClassName}
    >
      {icon}
      {label}
    </Button>
  )
}

export function ClientSubtabsNav({
  items,
  actions,
  actionButtons,
  className,
  tabsListClassName,
  triggerClassName,
  actionsClassName,
}: ClientSubtabsNavProps) {
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
                    className={cn(
                      clientSubtabsNavTriggerClassName,
                      triggerClassName
                    )}
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
                    className={cn(
                      clientSubtabsNavTriggerClassName,
                      triggerClassName
                    )}
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
              <ClientSubtabsNavActionButton
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
