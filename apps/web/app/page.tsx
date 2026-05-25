"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useData } from "@/hooks/use-data"
import { JewelryFilters } from "@/components/jewelry-filters"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useJewelryFilters } from "components-library-mtx/hooks"

export default function PageClient() {
  const [filters] = useJewelryFilters()

  const {
    data: jewelries,
    isLoading,
    error,
  } = useData({
    resource: "jewelries",
    params: {
      page: 1,
      per_page: 20,
      ...filters,
    },
  })

  const { data: session, isLoading: isSessionLoading } = useData({
    resource: "session",
  })

  if (error) return <div>Error fetching jewelries</div>

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-16">
      <h1 className="bg-muted py-5 text-center font-heading text-4xl font-bold">
        Jewelries for{" "}
        {isSessionLoading ? "loading..." : session?.full_name || "guest"} (CSR)
      </h1>

      <JewelryFilters />

      {isLoading ? (
        <JewelriesSkeleton />
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {jewelries?.data?.map((jewelry) => (
            <Card
              key={jewelry.id}
              className={cn(
                jewelry.images && jewelry.images.length > 0 && "pt-0"
              )}
            >
              {jewelry.images && jewelry.images.length > 0 && (
                <div className="relative aspect-square w-full">
                  <Image
                    src={jewelry.images?.[0] || "/"}
                    alt={jewelry.description}
                    fill
                    sizes="auto"
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{jewelry.description}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function JewelriesSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-8">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
