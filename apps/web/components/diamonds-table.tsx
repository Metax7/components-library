"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Bookmark, Copy, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table"

import { useToggleBookmark } from "components-library-mtx/hooks"
import { toggleBookmark } from "@/lib/wdpro/actions"
import { Stone, StoneResponse } from "components-library-mtx"

const BookmarkCell = ({ stone }: { stone: Stone }) => {
  const { mutate, isPending } = useToggleBookmark(toggleBookmark)

  return (
    <Button
      size="icon"
      variant={stone.is_bookmarked ? "default" : "outline"}
      title={stone.is_bookmarked ? "Remove from wishlist" : "Add to wishlist"}
      disabled={isPending}
      onClick={() =>
        mutate({
          id: stone.id,
          type: "stone",
          isBookmarked: stone.is_bookmarked,
        })
      }
    >
      <Bookmark className={stone.is_bookmarked ? "fill-current" : ""} />
    </Button>
  )
}

export const stoneColumns: ColumnDef<Stone>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "item_no",
    header: "Item No.",
  },
  {
    accessorKey: "shape_name",
    header: "Shape",
  },
  {
    accessorKey: "carats",
    header: "Carats",
  },
  {
    accessorKey: "color_code",
    header: "Color",
  },
  {
    accessorKey: "clarity_code",
    header: "Clarity",
  },
  {
    accessorKey: "cut_code",
    header: "Cut",
  },
  {
    accessorKey: "lab_name",
    header: "Lab",
  },
  {
    accessorKey: "rap_price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 font-medium"
          >
            Rap Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("rap_price"))
      if (isNaN(price)) return <div className="text-right font-medium">-</div>
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "wishlist",
    cell: ({ row }) => <BookmarkCell stone={row.original} />,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const stone = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(stone.item_no)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy item ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface DiamondsTableProps {
  response: StoneResponse
}

export default function DiamondsTable({ response }: DiamondsTableProps) {
  const { data, meta } = response
  const pageCount = meta?.page_count ?? meta?.total_pages

  return (
    <DataTable
      columns={stoneColumns}
      data={data}
      pageCount={pageCount}
      filterColumn="item_no"
      filterPlaceholder="Filter by item no..."
    />
  )
}
