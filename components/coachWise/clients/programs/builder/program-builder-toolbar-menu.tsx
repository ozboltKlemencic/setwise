"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

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
            "inline-flex h-8 min-w-[132px] items-center justify-between gap-2 rounded-sm border bg-neutral-50 px-2.5 text-[13px] font-normal shadow-none transition-colors data-[state=open]:shadow-sm",
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
