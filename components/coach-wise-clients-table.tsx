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
  IconDotsVertical,
  IconKey,
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

import { buildCoachWiseHref } from "@/components/coachWise/sidebar/route-utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

const clientColumnLabels: Record<string, string> = {
  header: "Stranke",
  type: "Status",
  phase: "Faza",
  status: "Check in",
  target: "Pridruzil",
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
  onOpenClientProfile: (id: number) => void
): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "header",
      header: () => <div className="w-[16rem] min-w-[16rem]">Stranke</div>,
      cell: ({ row }) => <ClientNameCell item={row.original} />,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Status",
      cell: ({ row }) => (
        <div className="w-32">
          <Badge variant="outline" className="px-1.5 text-muted-foreground">
            {row.original.type}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "phase",
      header: "Faza",
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
      header: "Check in",
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
      header: () => <div className="w-28 text-left">Pridruzil</div>,
      cell: ({ row }) => (
        <form
          className="w-28"
          onSubmit={(event) => {
            event.preventDefault()
            toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
              loading: `Saving ${row.original.header}`,
              success: "Done",
              error: "Error",
            })
          }}
        >
          <Label htmlFor={`${row.original.id}-target`} className="sr-only">
            Pridruzil
          </Label>
          <Input
            className="h-8 w-full border-transparent bg-transparent pl-0 text-left shadow-none hover:bg-input/30 focus-visible:border focus-visible:bg-background dark:bg-transparent dark:hover:bg-input/30 dark:focus-visible:bg-input/30"
            defaultValue={row.original.target}
            id={`${row.original.id}-target`}
          />
        </form>
      ),
    },
    {
      id: "actions",
      header: () => <div className="w-10" />,
      cell: ({ row }) => (
        <div className="flex w-10 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-sm"
                className="size-8 cursor-pointer rounded-md border-neutral-200/50 bg-transparent text-muted-foreground shadow-none transition-colors hover:border-neutral-200/75 hover:bg-neutral-50/70 hover:text-foreground data-[state=open]:border-neutral-200/75 data-[state=open]:bg-neutral-50/80"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">Odpri meni stranke</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-48 rounded-lg border-neutral-200/60 bg-white/95 p-1.5 shadow-lg shadow-black/5 backdrop-blur-sm"
            >
              <DropdownMenuItem
                className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950"
                onSelect={() => onOpenClientProfile(row.original.id)}
              >
                <IconKey className="size-4 text-neutral-500" />
                Dostop do stranke
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-[13px] focus:bg-neutral-50 focus:text-neutral-950">
                <IconPencil className="size-4 text-neutral-500" />
                Uredi
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-200/70" />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer rounded-md px-3 py-2 text-[13px]"
              >
                <IconTrash className="size-4" />
                Izbrisi
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
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
            cell.column.id === "actions" && "pr-4 lg:pr-5"
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
      router.push(buildCoachWiseHref(pathname, `/beta-coach-wise/clients/${id}`))
    },
    [pathname, router]
  )
  const preparedData = React.useMemo(() => {
    const filteredData = initialData.filter((item) => {
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
  }, [groupOption, initialData, sortOption, statusFilter])
  const columns = React.useMemo(
    () => getColumns(openClientProfile),
    [openClientProfile]
  )
  const activeFilterCount =
    (sortOption !== "recent-pridruzil" ? 1 : 0) +
    (groupOption !== "none" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0)

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
  const filterButtonLabel =
    activeFilterCount === 0
      ? "Filtri"
      : activeFilterCount === 1
        ? "1 filter"
        : `${activeFilterCount} filtri`

  React.useEffect(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 }
    )
  }, [clientSearch, groupOption, sortOption, statusFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 px-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-2xl">
          <div className="relative w-full sm:flex-1 lg:max-w-sm">
            <IconSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search clients"
              placeholder="Isci stranke..."
              value={clientSearch}
              onChange={(event) =>
                table.getColumn("header")?.setFilterValue(event.target.value)
              }
              className="pl-9 focus-visible:border-neutral-200 focus-visible:ring-0"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="justify-start border-neutral-200/70 bg-white/80 text-neutral-700 shadow-none hover:bg-neutral-50"
              >
                <IconAdjustmentsHorizontal className="size-4" />
                {filterButtonLabel}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-[340px] rounded-lg border-neutral-200/70 bg-white/95 p-4 shadow-xl shadow-black/5 backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3">
                  <div className="text-sm font-medium text-neutral-900">
                    Razvrsti po:
                  </div>
                  <Select
                    value={sortOption}
                    onValueChange={(value) =>
                      setSortOption(value as ClientSortOption)
                    }
                  >
                    <SelectTrigger className="w-full border-neutral-200 bg-white focus-visible:border-neutral-200 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-neutral-200/70">
                      <SelectItem value="recent-pridruzil">
                        Najnovejsi vpis
                      </SelectItem>
                      <SelectItem value="oldest-pridruzil">
                        Najstarejsi vpis
                      </SelectItem>
                      <SelectItem value="alphabetical-asc">
                        Abecedno (A-Z)
                      </SelectItem>
                      <SelectItem value="alphabetical-desc">
                        Abecedno (Z-A)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3">
                  <div className="text-sm font-medium text-neutral-900">
                    Skupina:
                  </div>
                  <Select
                    value={groupOption}
                    onValueChange={(value) =>
                      setGroupOption(value as ClientGroupOption)
                    }
                  >
                    <SelectTrigger className="w-full border-neutral-200 bg-white focus-visible:border-neutral-200 focus-visible:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border-neutral-200/70">
                      <SelectItem value="none">Brez</SelectItem>
                      <SelectItem value="phase">Faza</SelectItem>
                      <SelectItem value="type">Status stranke</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-[92px_minmax(0,1fr)] items-center gap-3">
                  <div className="text-sm font-medium text-neutral-900">
                    Status:
                  </div>
                  <div className="flex items-center rounded-md border border-neutral-200 bg-white p-1">
                    <button
                      type="button"
                      className={cn(
                        "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors",
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
                      Aktivni
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "flex-1 cursor-pointer rounded-sm px-3 py-1.5 text-sm transition-colors",
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
                      Zakljuceni
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                    onClick={() => {
                      setSortOption("recent-pridruzil")
                      setGroupOption("none")
                      setStatusFilter("all")
                    }}
                  >
                    Pocisti filtre
                  </button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns />
              <span className="hidden lg:inline">Prilagodi stolpce</span>
              <span className="lg:hidden">Stolpci</span>
              <IconChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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
                  className="capitalize"
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
                        header.column.id === "actions" && "pr-4 lg:pr-5"
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
                    Ni najdenih strank.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
          {table.getFilteredRowModel().rows.length} prikazanih strank
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Vrstic na stran
            </Label>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Stran {table.getState().pagination.pageIndex + 1} od{" "}
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
  )
}
