"use client"

import * as React from "react"
import { Check, ChevronDown, Search } from "lucide-react"

import type { NutritionBuilderClientOption } from "@/components/coachWise/clients/nutrition/nutrition-builder-client-options"
import {
  overflowActionsMenuContentClassName,
  overflowActionsMenuSurfaceClassName,
} from "@/components/coachWise/overflow-actions-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function NutritionBuilderClientPicker({
  clients,
  selectedClientIds,
  onSelectedClientIdsChange,
  className,
}: {
  clients: NutritionBuilderClientOption[]
  selectedClientIds: string[]
  onSelectedClientIdsChange: (nextClientIds: string[]) => void
  className?: string
}) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const selectedClients = React.useMemo(
    () => clients.filter((client) => selectedClientIds.includes(client.id)),
    [clients, selectedClientIds]
  )
  const filteredClients = React.useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return clients
    }

    return clients.filter((client) =>
      client.name.toLowerCase().includes(normalizedQuery)
    )
  }, [clients, searchQuery])
  const visibleClients = selectedClients.slice(0, 3)
  const remainingClients = selectedClients.length - visibleClients.length
  const triggerLabel =
    selectedClients.length === 0
      ? "Assign clients"
      : selectedClients.length === 1
        ? selectedClients[0].name
        : `${selectedClients[0].name} +${selectedClients.length - 1} others`

  const toggleClient = React.useCallback(
    (clientId: string) => {
      onSelectedClientIdsChange(
        selectedClientIds.includes(clientId)
          ? selectedClientIds.filter((entry) => entry !== clientId)
          : [...selectedClientIds, clientId]
      )
    },
    [onSelectedClientIdsChange, selectedClientIds]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-8 max-w-[260px] justify-between gap-2 rounded-sm border-neutral-200 bg-white px-2.5 text-[13px] font-normal text-neutral-700 shadow-none hover:bg-neutral-50",
            className
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            {selectedClients.length ? (
              <AvatarGroup className="shrink-0">
                {visibleClients.map((client) => (
                  <Avatar
                    key={client.id}
                    size="sm"
                    className="ring-white"
                  >
                    <AvatarImage src={client.avatar} alt={client.name} />
                    <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {remainingClients > 0 ? (
                  <AvatarGroupCount className="size-6 bg-neutral-100 text-[11px] text-neutral-600 ring-white">
                    +{remainingClients}
                  </AvatarGroupCount>
                ) : null}
              </AvatarGroup>
            ) : null}
            <span className="truncate">{triggerLabel}</span>
          </div>
          <ChevronDown className="size-3.5 shrink-0 text-neutral-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          overflowActionsMenuContentClassName,
          overflowActionsMenuSurfaceClassName,
          "w-64 p-1.5"
        )}
      >
        <DropdownMenuLabel className="px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
          Clients
        </DropdownMenuLabel>
        <div className="px-1.5 pb-1.5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search clients"
              className="h-8 w-full rounded-md border border-neutral-200 bg-neutral-50 pr-3 pl-8 text-[13px] text-neutral-700 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-300 focus:bg-white"
            />
          </div>
        </div>
        <DropdownMenuSeparator className="bg-neutral-200/70" />
        {filteredClients.map((client) => {
          const isSelected = selectedClientIds.includes(client.id)

          return (
            <button
              key={client.id}
              type="button"
              onClick={() => toggleClient(client.id)}
              className="flex w-full items-center gap-2 rounded-md py-2 pr-3 pl-3 text-left text-[13px] text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-950"
            >
              <span className="flex size-4 shrink-0 items-center justify-center">
                {isSelected ? (
                  <Check className="size-3.5 text-neutral-700" />
                ) : null}
              </span>
              <Avatar size="sm" className="ring-white">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
                  {getInitials(client.name)}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate">{client.name}</span>
            </button>
          )
        })}
        {!filteredClients.length ? (
          <div className="px-3 py-3 text-[12.5px] text-neutral-500">
            No clients found.
          </div>
        ) : null}
        {selectedClientIds.length ? (
          <>
            <DropdownMenuSeparator className="bg-neutral-200/70" />
            <button
              type="button"
              onClick={() => onSelectedClientIdsChange([])}
              className="flex w-full cursor-pointer items-center rounded-md px-3 py-2 text-left text-[13px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
            >
              Clear selection
            </button>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
