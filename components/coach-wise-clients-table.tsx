"use client"

import * as React from "react"
import {
  IconAdjustmentsHorizontal,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconLayoutColumns,
  IconLoader,
  IconPencil,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { z } from "zod"

import { CoachWiseConfirmationDialog } from "@/components/coachWise/confirmation-dialog"
import {
  ClientEditDialog,
  type ClientEditFormValues,
} from "@/components/coachWise/clients/client-edit-dialog"
import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { SecondaryActionButton } from "@/components/coachWise/secondary-action-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  overflowActionsMenuContentClassName,
  overflowActionsMenuItemClassName,
} from "@/components/coachWise/overflow-actions-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

const clientSchema = z.object({
  id: z.number(),
  avatar: z.string().optional(),
  header: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  type: z.string(),
  phase: z.string().optional(),
  status: z.string(),
  target: z.string(),
})

type Client = z.infer<typeof clientSchema>
type ClientSortOption =
  | "recent-pridruzil"
  | "oldest-pridruzil"
  | "alphabetical-asc"
  | "alphabetical-desc"
type ClientGroupOption = "none" | "phase" | "type"
type ClientStatusFilter = "all" | "active" | "completed"

const clientsToolbarDropdownCheckboxItemClassName =
  "cursor-pointer rounded-md py-2 pr-3 pl-8 text-[13px] font-normal text-neutral-800 focus:bg-neutral-50 focus:text-neutral-950"

const clientRowActionButtonClassName =
  "size-6 cursor-pointer rounded-md border-neutral-200/60 bg-neutral-100/85 text-muted-foreground shadow-none transition-colors hover:border-neutral-300/80 hover:bg-neutral-200/60 hover:text-foreground"

const clientRowDeleteActionButtonClassName =
  "border-rose-200/70 bg-rose-50/70 text-rose-500 hover:border-rose-300/80 hover:bg-rose-100/70 hover:text-rose-600"

function formatClientCountLabel(count: number) {
  return `${count} client${count === 1 ? "" : "s"}`
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

function parseClientDate(value: string) {
  const [day, month, year] = value.split(".").map(Number)

  if (!day || !month || !year) {
    return 0
  }

  return new Date(year, month - 1, day).getTime()
}

function splitClientName(name: string) {
  const [firstName = "", ...lastNameParts] = name.split(" ").filter(Boolean)

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  }
}

const clientColumnLabels: Record<string, string> = {
  header: "Client",
  type: "Status",
  phase: "Phase",
  status: "Check-in",
  target: "Joined",
}

function formatClientType(type: string) {
  switch (type) {
    case "Aktiven":
      return "Active"
    case "Na pavzi":
      return "Paused"
    case "Zakljucen":
      return "Completed"
    default:
      return type
  }
}

function ClientNameCell({ item }: { item: Client }) {
  return (
    <div className="flex w-[18rem] max-w-full items-center gap-3">
      <Avatar className="size-8">
        <AvatarImage src={item.avatar} alt={item.header} />
        <AvatarFallback>{getInitials(item.header)}</AvatarFallback>
      </Avatar>
      <span className="truncate font-medium text-foreground">{item.header}</span>
    </div>
  )
}

function getColumns(
  onUpdateClient: (id: number, values: ClientEditFormValues) => void,
  onDeleteClient: (client: Client) => void
): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "header",
      header: () => <div className="w-[16rem] min-w-[16rem]">Client</div>,
      cell: ({ row }) => <ClientNameCell item={row.original} />,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {formatClientType(row.original.type)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "phase",
      header: "Phase",
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.phase ?? "-"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Check-in",
      cell: ({ row }) => (
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.status === "Done" ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "target",
      header: () => <div className="w-28 text-left">Joined</div>,
      cell: ({ row }) => (
        <div className="w-28 text-left text-sm text-foreground">
          {row.original.target}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="w-[3.5rem] text-center">Action</div>,
      cell: ({ row }) => {
        const { firstName, lastName } = splitClientName(row.original.header)

        return (
          <div className="flex w-[3.5rem] justify-center gap-2">
            <ClientEditDialog
              firstName={firstName}
              lastName={lastName}
              email={row.original.email}
              phone={row.original.phone}
              status={row.original.type}
              phase={row.original.phase ?? "Bulk"}
              onSave={(values) => onUpdateClient(row.original.id, values)}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className={clientRowActionButtonClassName}
                >
                  <IconPencil className="size-3.5" />
                  <span className="sr-only">Edit client</span>
                </Button>
              }
            />
            <CoachWiseConfirmationDialog
              title="Are you sure you want to delete this client?"
              description={`${row.original.header} will be removed from the current clients list. This action can't be undone.`}
              confirmLabel="Delete client"
              variant="destructive"
              onConfirm={() => onDeleteClient(row.original)}
              trigger={
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  className={cn(
                    clientRowActionButtonClassName,
                    clientRowDeleteActionButtonClassName
                  )}
                >
                  <IconTrash className="size-3.5" />
                  <span className="sr-only">Delete client</span>
                </Button>
              }
            />
          </div>
        )
      },
    },
  ]
}

function isInteractiveElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest(
      "button, a, input, textarea, select, [data-prevent-row-click='true']"
    )
  )
}

function ClientRow({
  row,
  onOpen,
}: {
  row: Row<Client>
  onOpen: (id: number) => void
}) {
  const openProfile = React.useCallback(() => {
    onOpen(row.original.id)
  }, [onOpen, row.original.id])

  return (
    <TableRow
      role="link"
      tabIndex={0}
      className="cursor-pointer"
      onClick={(event) => {
        if (isInteractiveElement(event.target)) {
          return
        }

        openProfile()
      }}
      onKeyDown={(event) => {
        if (isInteractiveElement(event.target)) {
          return
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          openProfile()
        }
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          className={cn(
            cell.column.id === "header" && "pl-4 lg:pl-5",
            cell.column.id === "actions" && "px-1 pr-2 lg:pr-3"
          )}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function CoachWiseClientsTable({
  data: initialData,
}: {
  data: Client[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = React.useState<Client[]>(initialData)
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(() =>
      initialData.some((item) => item.phase)
        ? ({} as VisibilityState)
        : ({ phase: false } as VisibilityState)
    )
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sortOption, setSortOption] =
    React.useState<ClientSortOption>("recent-pridruzil")
  const [groupOption, setGroupOption] =
    React.useState<ClientGroupOption>("none")
  const [statusFilter, setStatusFilter] =
    React.useState<ClientStatusFilter>("all")
  const openClientProfile = React.useCallback(
    (id: number) => {
      router.push(
        buildCoachWiseHref(pathname, `/beta-coach-wise/clients/${id}/info`)
      )
    },
    [pathname, router]
  )
  const updateClient = React.useCallback(
    (id: number, values: ClientEditFormValues) => {
      setData((current) =>
        current.map((item) =>
          item.id === id
            ? {
              ...item,
              header: `${values.firstName} ${values.lastName}`.trim(),
              email: values.email,
              phone: values.phone,
              type: values.status,
              phase: values.phase,
            }
            : item
        )
      )
    },
    []
  )
  const deleteClient = React.useCallback((client: Client) => {
    setData((current) => current.filter((item) => item.id !== client.id))
    toast.success("Client was deleted successfully.", {
      description: `${client.header} was removed from the clients list.`,
    })
  }, [])
  const preparedData = React.useMemo(() => {
    const filteredData = data.filter((item) => {
      if (statusFilter === "active") {
        return item.type === "Aktiven"
      }

      if (statusFilter === "completed") {
        return item.type === "Zakljucen"
      }

      return true
    })

    return [...filteredData].sort((a, b) => {
      if (groupOption !== "none") {
        const groupA =
          groupOption === "phase" ? (a.phase ?? "").trim() : a.type.trim()
        const groupB =
          groupOption === "phase" ? (b.phase ?? "").trim() : b.type.trim()
        const groupCompare = groupA.localeCompare(groupB, "sl")

        if (groupCompare !== 0) {
          return groupCompare
        }
      }

      switch (sortOption) {
        case "oldest-pridruzil":
          return parseClientDate(a.target) - parseClientDate(b.target)
        case "alphabetical-asc":
          return a.header.localeCompare(b.header, "sl")
        case "alphabetical-desc":
          return b.header.localeCompare(a.header, "sl")
        case "recent-pridruzil":
        default:
          return parseClientDate(b.target) - parseClientDate(a.target)
      }
    })
  }, [data, groupOption, sortOption, statusFilter])
  const columns = React.useMemo(
    () => getColumns(updateClient, deleteClient),
    [deleteClient, updateClient]
  )
  const table = useReactTable({
    data: preparedData,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const clientSearch = (table.getColumn("header")?.getFilterValue() as string) ?? ""
  const filteredClientsCount = table.getFilteredRowModel().rows.length
  const filterButtonLabel = formatClientCountLabel(filteredClientsCount)

  React.useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
    )
  }, [clientSearch, groupOption, preparedData.length, sortOption, statusFilter])

  return (
    <div className="flex flex-col px-2 gap-4">
      <div className="flex flex-col gap-3  px-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-1 sm:flex-row sm:items-center lg:max-w-2xl">
          <div className="relative w-full sm:flex-1 lg:max-w-xs">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search clients"
              placeholder="Search clients..."
              value={clientSearch}
              onChange={(event) =>
                table.getColumn("header")?.setFilterValue(event.target.value)
              }
              className="pl-9 focus-visible:border-neutral-200 focus-visible:ring-0"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SecondaryActionButton
                label={filterButtonLabel}
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
                  <Select
                    value={sortOption}
                    onValueChange={(value) =>
                      setSortOption(value as ClientSortOption)
                    }
                  >
                    <SelectTrigger className="h-8 w-full border-neutral-200 bg-white text-[13px] font-normal text-neutral-700 shadow-none focus-visible:border-neutral-200 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-neutral-200/70 shadow-lg shadow-black/5 [&_[data-slot=select-item]]:py-2 [&_[data-slot=select-item]]:text-[13px] [&_[data-slot=select-item]]:font-normal">
                      <SelectItem value="recent-pridruzil">
                        Newest join date
                      </SelectItem>
                      <SelectItem value="oldest-pridruzil">
                        Oldest join date
                      </SelectItem>
                      <SelectItem value="alphabetical-asc">
                        Alphabetical (A-Z)
                      </SelectItem>
                      <SelectItem value="alphabetical-desc">
                        Alphabetical (Z-A)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[88px_minmax(0,1fr)] items-center gap-3">
                  <div className="text-[13px] font-medium text-neutral-900">
                    Group by:
                  </div>
                  <Select
                    value={groupOption}
                    onValueChange={(value) =>
                      setGroupOption(value as ClientGroupOption)
                    }
                  >
                    <SelectTrigger className="h-8 w-full border-neutral-200 bg-white text-[13px] font-normal text-neutral-700 shadow-none focus-visible:border-neutral-200 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-md border-neutral-200/70 shadow-lg shadow-black/5 [&_[data-slot=select-item]]:py-2 [&_[data-slot=select-item]]:text-[13px] [&_[data-slot=select-item]]:font-normal">
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
                        setStatusFilter((current) =>
                          current === "active" ? "all" : "active"
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
                        setStatusFilter((current) =>
                          current === "completed" ? "all" : "completed"
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
                    onClick={() => {
                      setSortOption("recent-pridruzil")
                      setGroupOption("none")
                      setStatusFilter("all")
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SecondaryActionButton
              icon={IconLayoutColumns}
              label={
                <>
                  <span className="hidden lg:inline">Customize columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown className="size-4" />
                </>
              }
              className="justify-start"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className={cn(overflowActionsMenuContentClassName, "w-56")}
          >
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide()
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className={cn(
                    overflowActionsMenuItemClassName,
                    clientsToolbarDropdownCheckboxItemClassName,
                    "capitalize"
                  )}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {clientColumnLabels[column.id] ?? column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="px-2">
        <div className="overflow-hidden rounded-sm border">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        header.column.id === "header" && "pl-4 lg:pl-5",
                        header.column.id === "actions" && "px-1 pr-2 lg:pr-3"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <ClientRow
                    key={row.id}
                    row={row}
                    onOpen={openClientProfile}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="ml-auto flex w-full justify-end lg:w-fit">
          <div className="flex items-center gap-8">
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
