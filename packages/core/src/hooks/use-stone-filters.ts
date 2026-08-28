"use client"

import { useQueryStates, parseAsString, parseAsFloat } from "nuqs"

/**
 * Hook to manage stone/diamond filter parameters via URL query state.
 * 
 * Synchronizes component filters with URL parameters and vice versa.
 * Supports filtering by carat weight, color, clarity, lab certification, etc.
 * 
 * @returns A tuple of [currentFilters, setFilter] for programmatic control
 */
export function useStoneFilters() {
  return useQueryStates({
    item_no: parseAsString,
    description: parseAsString,
    stone_type: parseAsString,
    color: parseAsString,
    clarity: parseAsString,
    shape: parseAsString,
    carats_min: parseAsFloat,
    carats_max: parseAsFloat,
    price_min: parseAsFloat,
    price_max: parseAsFloat,
    lab: parseAsString,
    cut: parseAsString,
    polish: parseAsString,
    symmetry: parseAsString,
    fluorescence: parseAsString,
  })
}

export type StoneFilters = ReturnType<typeof useStoneFilters>[0]
