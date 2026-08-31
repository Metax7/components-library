"use client"

import { useQueryStates, parseAsString, parseAsFloat } from "nuqs"

/**
 * Hook to manage jewelry filter parameters via URL query state.
 * 
 * Synchronizes component filters with URL parameters and vice versa.
 * Supports filtering by category, material, stone type, price range, etc.
 * 
 * @returns A tuple of [currentFilters, setFilter] for programmatic control
 */
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
