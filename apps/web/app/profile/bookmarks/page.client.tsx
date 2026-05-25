"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useData } from "@/hooks/use-data"
import { useToggleBookmark } from "components-library-mtx/hooks"
import { toggleBookmark } from "@/lib/wdpro/actions"

export default function BookmarksClient() {
  const {
    data: bookmarks,
    isLoading,
    isError,
  } = useData({
    resource: "bookmarks",
    params: {
      sort_by: "created_at",
      sort_dir: "desc",
    },
  })

  const { mutate, isPending } = useToggleBookmark(toggleBookmark)

  if (isError) {
    return <div>Error loading bookmarks</div>
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      {isLoading ? (
        <BookmarksSkeleton />
      ) : (
        bookmarks?.data.map((bookmark) => (
          <Card key={bookmark.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>
                {bookmark.item.type === "diamond"
                  ? bookmark.item.item_no
                  : bookmark.item.description}
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    id:
                      bookmark.item.type === "diamond"
                        ? bookmark.stone_id!
                        : bookmark.jewelry_id!,
                    type: bookmark.item.type as "stone" | "jewelry" | "diamond",
                    isBookmarked: true,
                  })
                }
              >
                <Bookmark className="h-4 w-4 fill-current" />
              </Button>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  )
}

function BookmarksSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
