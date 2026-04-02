"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { overflowActionsMenuSurfaceClassName } from "@/components/coachWise/overflow-actions-menu"
import { secondaryActionButtonClassName } from "@/components/coachWise/secondary-action-button"
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
            secondaryActionButtonClassName,
            "h-8 min-w-[132px] justify-between gap-2 px-2.5 data-[state=open]:border-neutral-300/80 data-[state=open]:bg-neutral-200/55 data-[state=open]:text-neutral-800",
            triggerClassName
          )}
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="size-3.5 shrink-0 text-neutral-400" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className={cn(
          overflowActionsMenuSurfaceClassName,
          "w-64 p-1.5",
          contentClassName
        )}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
