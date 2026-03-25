"use client"

import { IconChevronDown, IconLayoutColumns } from "@tabler/icons-react"
import type { Table } from "@tanstack/react-table"

import {
  overflowActionsMenuContentClassName,
  overflowActionsMenuItemClassName,
} from "@/components/coachWise/overflow-actions-menu"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const columnVisibilityCheckboxItemClassName =
  "cursor-pointer rounded-md py-2 pr-3 pl-8 text-[13px] font-normal text-neutral-800 focus:bg-neutral-50 focus:text-neutral-950 capitalize"

type ColumnVisibilityMenuProps<TData> = {
  table: Table<TData>
  columnLabels?: Record<string, string>
  label?: string
  compactLabel?: string
  contentClassName?: string
  itemClassName?: string
}

export function ColumnVisibilityMenu<TData>({
  table,
  columnLabels,
  label = "Customize columns",
  compactLabel = "Columns",
  contentClassName,
  itemClassName,
}: ColumnVisibilityMenuProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SecondaryActionButton
          icon={IconLayoutColumns}
          label={
            <>
              <span className="hidden lg:inline">{label}</span>
              <span className="lg:hidden">{compactLabel}</span>
              <IconChevronDown className="size-4" />
            </>
          }
          className="justify-start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(overflowActionsMenuContentClassName, "w-56", contentClassName)}
      >
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              className={cn(
                overflowActionsMenuItemClassName,
                columnVisibilityCheckboxItemClassName,
                itemClassName
              )}
              checked={column.getIsVisible()}
              onCheckedChange={(value) => column.toggleVisibility(!!value)}
            >
              {columnLabels?.[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
