"use client"

import { IconSearch, type Icon } from "@tabler/icons-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ToolbarSearchInputProps = {
  value: string
  onValueChange: (value: string) => void
  ariaLabel?: string
  placeholder?: string
  icon?: Icon
  wrapperClassName?: string
  className?: string
}

export function ToolbarSearchInput({
  value,
  onValueChange,
  ariaLabel = "Search",
  placeholder = "Search...",
  icon: SearchIcon = IconSearch,
  wrapperClassName,
  className,
}: ToolbarSearchInputProps) {
  return (
    <div className={cn("relative w-full", wrapperClassName)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label={ariaLabel}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          "pl-9 focus-visible:border-neutral-200 focus-visible:ring-0",
          className
        )}
      />
    </div>
  )
}
