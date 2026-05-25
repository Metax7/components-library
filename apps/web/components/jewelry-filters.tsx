"use client"

import { useData } from "@/hooks/use-data"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import { Skeleton } from "./ui/skeleton"
import { Slider } from "./ui/slider"
import { useJewelryFilters } from "components-library-mtx/hooks"

export function JewelryFilters() {
  const [filters, setFilters] = useJewelryFilters()

  const { data: properties, isLoading } = useData({
    resource: "properties",
    params: {
      type: "jewelry",
      category: filters.category || undefined,
      sub_category: filters.sub_category || undefined,
    },
  })

  const jewelryProps =
    properties && "category" in properties ? properties : null

  const clearFilters = () => setFilters(null)

  const handleFilterChange = (key: string, value: string | number | null) => {
    if (key === "category") {
      setFilters({
        category: value === "all" ? null : (value as string),
        sub_category: null,
        metal_type: null,
        metal_color: null,
        item_no: null,
        description: null,
        price_min: null,
        price_max: null,
        metal_weight_min: null,
        metal_weight_max: null,
      })
    } else if (key === "sub_category") {
      setFilters({
        sub_category: value === "all" ? null : (value as string),
        metal_type: null,
        metal_color: null,
        item_no: null,
        description: null,
        price_min: null,
        price_max: null,
        metal_weight_min: null,
        metal_weight_max: null,
      })
    } else {
      setFilters({ [key]: value ?? null })
    }
  }

  if (isLoading) return <FiltersSkeleton />

  return (
    <div className="flex flex-col gap-6 border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-8 px-2 text-muted-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(v) =>
              handleFilterChange("category", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {jewelryProps &&
                Object.keys(jewelryProps.category).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sub Category */}
        <div className="space-y-2">
          <Label>Sub Category</Label>
          <Select
            value={filters.sub_category || "all"}
            onValueChange={(v) =>
              handleFilterChange("sub_category", v === "all" ? null : v)
            }
            disabled={!filters.category}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Sub Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub Categories</SelectItem>
              {jewelryProps &&
                filters.category &&
                jewelryProps.category[filters.category]?.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metal Type */}
        <div className="space-y-2">
          <Label>Metal Type</Label>
          <Select
            value={filters.metal_type || "all"}
            onValueChange={(v) =>
              handleFilterChange("metal_type", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Metals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metals</SelectItem>
              {jewelryProps?.metal_type.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Metal Color */}
        <div className="space-y-2">
          <Label>Metal Color</Label>
          <Select
            value={filters.metal_color || "all"}
            onValueChange={(v) =>
              handleFilterChange("metal_color", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {jewelryProps?.metal_color.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Item Number */}
        <div className="space-y-2">
          <Label>Item No</Label>
          <Input
            placeholder="Search Item No..."
            value={filters.item_no || ""}
            onChange={(e) => handleFilterChange("item_no", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            placeholder="Search Description..."
            value={filters.description || ""}
            onChange={(e) => handleFilterChange("description", e.target.value)}
          />
        </div>

        {/* Price Range */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label>
              Price: ${filters.price_min ?? jewelryProps?.price_min} - $
              {filters.price_max ?? jewelryProps?.price_max}
            </Label>
          </div>
          <Slider
            value={[
              filters.price_min ?? jewelryProps?.price_min ?? 0,
              (filters.price_max ?? jewelryProps?.price_max) as number,
            ]}
            min={jewelryProps?.price_min ?? 0}
            max={jewelryProps?.price_max ?? 10000}
            step={100}
            onValueChange={([min, max]) =>
              setFilters({ price_min: min, price_max: max })
            }
          />
        </div>

        {/* Metal Weight Range */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label>
              Weight:{" "}
              {filters.metal_weight_min ?? jewelryProps?.metal_weight_min}g -{" "}
              {filters.metal_weight_max ?? jewelryProps?.metal_weight_max}g
            </Label>
          </div>
          <Slider
            value={[
              filters.metal_weight_min ?? jewelryProps?.metal_weight_min ?? 0,
              (filters.metal_weight_max ??
                jewelryProps?.metal_weight_max) as number,
            ]}
            min={jewelryProps?.metal_weight_min ?? 0}
            max={jewelryProps?.metal_weight_max ?? 50}
            step={0.1}
            onValueChange={([min, max]) =>
              setFilters({ metal_weight_min: min, metal_weight_max: max })
            }
          />
        </div>
      </div>
    </div>
  )
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
