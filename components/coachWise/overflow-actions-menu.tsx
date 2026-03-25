"use client"

import * as React from "react"
import Link from "next/link"
import { IconDotsVertical } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type OverflowActionsMenuIcon = React.ComponentType<{ className?: string }>

type OverflowActionsMenuBaseItem = {
  id: string
  label: string
  icon?: OverflowActionsMenuIcon
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive"
}

type OverflowActionsMenuLinkItem = OverflowActionsMenuBaseItem & {
  href: string
  target?: React.HTMLAttributeAnchorTarget
  onSelect?: never
}

type OverflowActionsMenuActionItem = OverflowActionsMenuBaseItem & {
  onSelect: () => void | Promise<void>
  href?: never
  target?: never
}

type OverflowActionsMenuSeparatorItem = {
  id: string
  type: "separator"
}

export type OverflowActionsMenuItem =
  | OverflowActionsMenuLinkItem
  | OverflowActionsMenuActionItem
  | OverflowActionsMenuSeparatorItem

type OverflowActionsMenuProps = {
  items: OverflowActionsMenuItem[]
  trigger?: React.ReactNode
  triggerLabel?: string
  triggerClassName?: string
  contentClassName?: string
  itemClassName?: string
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"]
  sideOffset?: number
}

export const overflowActionsMenuTriggerClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/45 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/70 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/70 data-[state=open]:bg-neutral-50/80"

export const overflowActionsMenuContentClassName =
  "w-48 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"

export const overflowActionsMenuItemClassName =
  "cursor-pointer rounded-md px-3 py-2 text-[13px]"

function isSeparatorItem(
  item: OverflowActionsMenuItem
): item is OverflowActionsMenuSeparatorItem {
  return "type" in item && item.type === "separator"
}

function isLinkItem(
  item: OverflowActionsMenuItem
): item is OverflowActionsMenuLinkItem {
  return "href" in item && typeof item.href === "string"
}

function renderMenuItemInner(
  item: OverflowActionsMenuLinkItem | OverflowActionsMenuActionItem
) {
  const Icon = item.icon

  return (
    <>
      {Icon ? (
        <Icon
          className={cn(
            "size-4",
            item.variant === "destructive" ? "" : "text-neutral-500"
          )}
        />
      ) : null}
      {item.label}
    </>
  )
}

export function OverflowActionsMenu({
  items,
  trigger,
  triggerLabel = "Open actions menu",
  triggerClassName,
  contentClassName,
  itemClassName,
  align = "end",
  sideOffset = 8,
}: OverflowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className={cn(
              overflowActionsMenuTriggerClassName,
              triggerClassName
            )}
          >
            <IconDotsVertical className="size-3" />
            <span className="sr-only">{triggerLabel}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={cn(overflowActionsMenuContentClassName, contentClassName)}
      >
        {items.map((item) => {
          if (isSeparatorItem(item)) {
            return (
              <DropdownMenuSeparator
                key={item.id}
                className="bg-neutral-200/70"
              />
            )
          }

          const sharedItemClassName = cn(
            overflowActionsMenuItemClassName,
            item.variant === "default" || !item.variant
              ? "focus:bg-neutral-50 focus:text-neutral-950"
              : undefined,
            item.className,
            itemClassName
          )

          if (isLinkItem(item)) {
            return (
              <DropdownMenuItem
                key={item.id}
                asChild
                disabled={item.disabled}
                variant={item.variant}
                className={sharedItemClassName}
              >
                <Link
                  href={item.href}
                  target={item.target}
                  rel={item.target === "_blank" ? "noreferrer" : undefined}
                >
                  {renderMenuItemInner(item)}
                </Link>
              </DropdownMenuItem>
            )
          }

          return (
            <DropdownMenuItem
              key={item.id}
              disabled={item.disabled}
              variant={item.variant}
              className={sharedItemClassName}
              onSelect={() => {
                if (item.disabled) {
                  return
                }

                void item.onSelect()
              }}
            >
              {renderMenuItemInner(item)}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
