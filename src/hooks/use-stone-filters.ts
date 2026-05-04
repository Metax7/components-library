"use client"

import { useQueryStates, parseAsString, parseAsFloat } from "nuqs"

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
