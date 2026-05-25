"use client"

import { useQueryStates, parseAsInteger, parseAsIndex } from "nuqs"
import { useData } from "@/hooks/use-data"
import QuotesTable from "@/components/quotes-table"
import { Skeleton } from "@/components/ui/skeleton"
import { QuoteResponse } from "components-library-mtx"

export default function PageClient() {
  const [tableState] = useQueryStates({
    page: parseAsIndex.withDefault(0),
    perPage: parseAsInteger.withDefault(10),
  })

  const {
    data: quotes,
    isLoading,
    error,
  } = useData({
    resource: "quotes",
    params: {
      page: tableState.page + 1,
      per_page: tableState.perPage,
    },
  })

  if (error) return <div>Error fetching quotes</div>

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-16">
      <h1 className="bg-muted py-5 text-center font-heading text-4xl font-bold">
        Quotes
      </h1>

      {isLoading ? (
        <QuotesSkeleton />
      ) : (
        <QuotesTable response={quotes as QuoteResponse} />
      )}
    </div>
  )
}

function QuotesSkeleton() {
  return (
    <div className="rounded-md border bg-card">
      <div className="w-full">
        <div className="flex border-b px-4 py-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mx-2 h-6 w-25 flex-1" />
          ))}
        </div>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex border-b px-4 py-4">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton key={j} className="mx-2 h-4 w-20 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
