"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useQueryStates,
  parseAsInteger,
  parseAsIndex,
  parseAsJson,
  parseAsArrayOf,
} from "nuqs"
import { ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Field } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { useQuote } from "components-library-mtx/hooks"
import { createQuote } from "@/lib/wdpro/actions"
import { Spinner } from "./ui/spinner"
import { toast } from "sonner"

interface DataTableProps<TData extends { id: number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount?: number
  filterColumn?: string
  filterPlaceholder?: string
}

export function DataTable<TData extends { id: number }, TValue>({
  columns,
  data,
  pageCount,
  filterColumn,
  filterPlaceholder = "Filter...",
}: DataTableProps<TData, TValue>) {
  const [openDialog, setOpenDialog] = React.useState(false)
  const [notes, setNotes] = React.useState("")

  const [tableState, setTableState] = useQueryStates({
    page: parseAsIndex.withDefault(0),
    perPage: parseAsInteger.withDefault(10),
    selectedItems: parseAsArrayOf(parseAsInteger).withDefault([]),
  })

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  // Derive current-page rowSelection from URL-persisted selectedRows (array of original.id)
  // TanStack Table keys rowSelection by string index, so we must use String(index)
  const rowSelection = React.useMemo(() => {
    return data.reduce(
      (acc, row, index) => {
        if (tableState.selectedItems.includes(row.id)) {
          acc[String(index)] = true
        }
        return acc
      },
      {} as Record<string, boolean>
    )
  }, [data, tableState.selectedItems])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const current = {
        pageIndex: tableState.page,
        pageSize: tableState.perPage,
      }
      const next = typeof updater === "function" ? updater(current) : updater
      setTableState({
        page: next.pageIndex,
        perPage: next.pageSize,
      })
    },
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater
      // TanStack Table uses string keys — filter by String(index)
      const currentPageSelectedIds = data
        .filter((_, index) => next[String(index)])
        .map((row) => row.id) // row.id === original.id (TData extends { id: number })
      // keep selections from other pages untouched
      const currentPageIds = new Set(data.map((row) => row.id))
      const otherPageSelectedIds = tableState.selectedItems.filter(
        (id) => !currentPageIds.has(id)
      )
      setTableState({
        selectedItems: [...otherPageSelectedIds, ...currentPageSelectedIds],
      })
    },
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: tableState.page,
        pageSize: tableState.perPage,
      },
    },
  })

  const { mutate, isPending } = useQuote(createQuote)

  const handleQuote = async () => {
    mutate(
      {
        type: "stone",
        notes,
        ids: tableState.selectedItems,
      },
      {
        onSuccess() {
          setOpenDialog(false)
          setNotes("")
          setTableState({ selectedItems: [] })
          toast.success("Quote requested successfully")
        },
      }
    )
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex w-1/3 items-center gap-4">
          {filterColumn && (
            <Input
              placeholder={filterPlaceholder}
              value={
                (table.getColumn(filterColumn)?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn(filterColumn)
                  ?.setFilterValue(event.target.value)
              }
              className="bg-background"
            />
          )}
          {tableState.selectedItems.length > 0 && (
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Request a quote ({tableState.selectedItems.length})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Request a quote ({tableState.selectedItems.length})
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    dialog description
                  </DialogDescription>
                </DialogHeader>
                <Field>
                  <Textarea
                    placeholder="Add additional notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Field>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button disabled={isPending} onClick={handleQuote}>
                    Request a quote {isPending && <Spinner />}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {tableState.selectedItems.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${tableState.perPage}`}
              onValueChange={(value) => {
                setTableState({ perPage: Number(value), page: 0 })
              }}
            >
              <SelectTrigger className="h-8 w-17.5">
                <SelectValue placeholder={tableState.perPage} />
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
          <div className="flex w-25 items-center justify-center text-sm font-medium">
            Page {tableState.page + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
