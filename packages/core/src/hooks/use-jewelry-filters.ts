"use client"

import { useQueryStates, parseAsString, parseAsFloat } from "nuqs"

export function useJewelryFilters() {
  return useQueryStates({
    category: parseAsString,
    sub_category: parseAsString,
    description: parseAsString,
    item_no: parseAsString,
    metal_type: parseAsString,
    metal_color: parseAsString,
    metal_karat: parseAsString,
    stone_type: parseAsString,
    stone_color: parseAsString,
    stone_shape: parseAsString,
    design: parseAsString,
    model: parseAsString,
    size: parseAsString,
    price_min: parseAsFloat,
    price_max: parseAsFloat,
    metal_weight_min: parseAsFloat,
    metal_weight_max: parseAsFloat,
  })
}

export type JewelryFilters = ReturnType<typeof useJewelryFilters>[0]
