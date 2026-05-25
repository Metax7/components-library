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
import { Slider } from "./ui/slider"
import { useStoneFilters } from "components-library-mtx/hooks"

export function StoneFilters() {
  const [filters, setFilters] = useStoneFilters()

  const { data: properties } = useData({
    resource: "properties",
    params: {
      type: "stone",
    },
  })

  const stoneProps = properties && "clarity" in properties ? properties : null

  const clearFilters = () => setFilters(null)

  const handleFilterChange = (key: string, value: string | number | null) => {
    setFilters({ [key]: value ?? null })
  }

  return (
    <div className="flex flex-col gap-6 border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Stone Filters</h2>
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
        {/* Shape */}
        <div className="space-y-2">
          <Label>Shape</Label>
          <Select
            value={filters.shape || "all"}
            onValueChange={(v) =>
              handleFilterChange("shape", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Shapes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shapes</SelectItem>
              {stoneProps?.shape.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Color</Label>
          <Select
            value={filters.color || "all"}
            onValueChange={(v) =>
              handleFilterChange("color", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Colors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Colors</SelectItem>
              {stoneProps?.color.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clarity */}
        <div className="space-y-2">
          <Label>Clarity</Label>
          <Select
            value={filters.clarity || "all"}
            onValueChange={(v) =>
              handleFilterChange("clarity", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Clarities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clarities</SelectItem>
              {stoneProps?.clarity.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cut */}
        <div className="space-y-2">
          <Label>Cut</Label>
          <Select
            value={filters.cut || "all"}
            onValueChange={(v) =>
              handleFilterChange("cut", v === "all" ? null : v)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Cuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cuts</SelectItem>
              {stoneProps?.cut.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Carat Range */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <Label>
              Carats: {filters.carats_min ?? stoneProps?.carats_min} -{" "}
              {filters.carats_max ?? stoneProps?.carats_max}
            </Label>
          </div>
          <Slider
            value={[
              filters.carats_min ?? stoneProps?.carats_min ?? 0,
              filters.carats_max ?? stoneProps?.carats_max ?? 10,
            ]}
            min={stoneProps?.carats_min ?? 0}
            max={stoneProps?.carats_max ?? 10}
            step={0.01}
            onValueChange={([min, max]) =>
              setFilters({ carats_min: min, carats_max: max })
            }
          />
        </div>

        {/* Price Range */}
        {stoneProps?.price_max && stoneProps.price_min && (
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center justify-between">
              <Label>
                Price: $ {filters.price_min ?? stoneProps?.price_min} - ${" "}
                {filters.price_max ?? stoneProps?.price_max}
              </Label>
            </div>
            <Slider
              value={[
                filters.price_min ?? stoneProps?.price_min ?? 0,
                filters.price_max ?? stoneProps?.price_max ?? 10000,
              ]}
              min={stoneProps?.price_min ?? 0}
              max={stoneProps?.price_max ?? 10000}
              step={100}
              onValueChange={([min, max]) =>
                setFilters({ price_min: min, price_max: max })
              }
            />
          </div>
        )}

        {/* Item Number */}
        <div className="space-y-2 lg:col-span-2">
          <Label>Item No</Label>
          <Input
            placeholder="Search Item No..."
            value={filters.item_no || ""}
            onChange={(e) => handleFilterChange("item_no", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
