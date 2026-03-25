"use client"

import { IconAdjustmentsHorizontal } from "@tabler/icons-react"

import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export type ClientSortOption =
  | "recent-pridruzil"
  | "oldest-pridruzil"
  | "alphabetical-asc"
  | "alphabetical-desc"

export type ClientGroupOption = "none" | "phase" | "type"

export type ClientStatusFilter = "all" | "active" | "completed"

type ClientsTableFilterMenuProps = {
  label: string
  sortOption: ClientSortOption
  onSortOptionChange: (value: ClientSortOption) => void
  groupOption: ClientGroupOption
  onGroupOptionChange: (value: ClientGroupOption) => void
  statusFilter: ClientStatusFilter
  onStatusFilterChange: (value: ClientStatusFilter) => void
  onClear: () => void
}

const filterSelectTriggerClassName =
  "h-8 w-full border-neutral-200 bg-white text-[13px] font-normal text-neutral-700 shadow-none focus-visible:border-neutral-200 focus-visible:ring-0"

const filterSelectContentClassName =
  "rounded-md border-neutral-200/70 shadow-lg shadow-black/5 [&_[data-slot=select-item]]:py-2 [&_[data-slot=select-item]]:text-[13px] [&_[data-slot=select-item]]:font-normal"

export function ClientsTableFilterMenu({
  label,
  sortOption,
  onSortOptionChange,
  groupOption,
  onGroupOptionChange,
  statusFilter,
  onStatusFilterChange,
  onClear,
}: ClientsTableFilterMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SecondaryActionButton
          label={label}
          icon={IconAdjustmentsHorizontal}
          className="justify-start"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={8}
        className="w-[320px] rounded-lg border-neutral-200/70 bg-white/95 p-3.5 shadow-xl shadow-black/5 backdrop-blur-sm"
      >
        <div className="space-y-2">
          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
            <div className="text-[13px] font-medium text-neutral-900">
              Sort by:
            </div>
            <Select value={sortOption} onValueChange={onSortOptionChange}>
              <SelectTrigger className={filterSelectTriggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={filterSelectContentClassName}>
                <SelectItem value="recent-pridruzil">Newest join date</SelectItem>
                <SelectItem value="oldest-pridruzil">Oldest join date</SelectItem>
                <SelectItem value="alphabetical-asc">Alphabetical (A-Z)</SelectItem>
                <SelectItem value="alphabetical-desc">Alphabetical (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
            <div className="text-[13px] font-medium text-neutral-900">
              Group by:
            </div>
            <Select value={groupOption} onValueChange={onGroupOptionChange}>
              <SelectTrigger className={filterSelectTriggerClassName}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className={filterSelectContentClassName}>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="phase">Phase</SelectItem>
                <SelectItem value="type">Client status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
            <div className="text-[13px] font-medium text-neutral-900">
              Status:
            </div>
            <div className="flex items-center rounded-md border border-neutral-200 bg-white p-0.5 shadow-none">
              <button
                type="button"
                className={cn(
                  "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-[13px] font-normal transition-colors",
                  statusFilter === "active"
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
                onClick={() =>
                  onStatusFilterChange(
                    statusFilter === "active" ? "all" : "active"
                  )
                }
              >
                Active
              </button>
              <button
                type="button"
                className={cn(
                  "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-[13px] font-normal transition-colors",
                  statusFilter === "completed"
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-600 hover:text-neutral-900"
                )}
                onClick={() =>
                  onStatusFilterChange(
                    statusFilter === "completed" ? "all" : "completed"
                  )
                }
              >
                Completed
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="cursor-pointer text-[13px] font-medium text-brand-600 transition-colors hover:text-brand-700"
              onClick={onClear}
            >
              Clear filters
            </button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
