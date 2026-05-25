"use client"

import { Skeleton } from "@/components/ui/skeleton"

import { useQueryStates, parseAsInteger, parseAsIndex } from "nuqs"
import DiamondsTable from "@/components/diamonds-table"
import { useData } from "@/hooks/use-data"
import { StoneFilters } from "@/components/stone-filters"
import { StoneResponse } from "components-library-mtx"
import { useStoneFilters } from "components-library-mtx/hooks"

export default function Page() {
  const [filters] = useStoneFilters()
  const [tableState] = useQueryStates({
    page: parseAsIndex.withDefault(0),
    perPage: parseAsInteger.withDefault(10),
  })

  const {
    data: stones,
    isLoading,
    error,
  } = useData({
    resource: "stones",
    params: {
      page: tableState.page + 1,
      per_page: tableState.perPage,
      ...filters,
    },
  })

  const { data: session, isLoading: isSessionLoading } = useData({
    resource: "session",
  })

  if (error) return <div>Error fetching Diamonds</div>

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-16">
      <h1 className="bg-muted py-5 text-center font-heading text-4xl font-bold">
        Diamonds for{" "}
        {isSessionLoading ? "loading..." : session?.full_name || "guest"}
      </h1>

      <StoneFilters />

      {isLoading ? (
        <DiamondsSkeleton />
      ) : (
        <DiamondsTable response={stones as StoneResponse} />
      )}
    </div>
  )
}

function DiamondsSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      <div className="w-full">
        <div className="flex border-b px-4 py-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="mx-2 h-6 w-25 flex-1" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex border-b px-4 py-4">
            {Array.from({ length: 8 }).map((_, j) => (
              <Skeleton key={j} className="mx-2 h-4 w-20 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
