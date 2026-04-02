"use client"

import * as React from "react"

import { overflowActionsMenuSurfaceClassName } from "@/components/coachWise/overflow-actions-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ProgramBuilderToolbarMenuProps = {
  label: string
  children: React.ReactNode
  triggerClassName?: string
  contentClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ProgramBuilderToolbarMenu({
  label,
  children,
  triggerClassName,
  contentClassName,
  open,
  onOpenChange,
}: ProgramBuilderToolbarMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 items-center rounded-md border px-3 text-[12px] font-medium shadow-none transition-colors data-[state=open]:shadow-sm",
            triggerClassName
          )}
        >
          {label}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "min-w-[220px] p-2",
          contentClassName
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
