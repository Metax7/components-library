import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import BookmarksClient from "./page.client"
import { getBookmarks, getSession } from "@/lib/wdpro/dal"

export default async function BookmarksPage() {
  const user = await getSession()

  if (!user) {
    redirect("/sign-in")
  }

  const bookmarks = await getBookmarks()

  if (!bookmarks) {
    return (
      <div className="container mx-auto flex flex-col gap-10 px-4 py-16">
        <h1 className="text-center font-heading text-4xl font-bold">
          Bookmarks
        </h1>
        <p className="text-center">No bookmarks found</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col gap-10 px-4 py-16">
      <h1 className="text-center font-heading text-4xl font-bold">
        Bookmarks (SSR)
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {bookmarks.data.map((bookmark) => (
          <Card key={bookmark.id}>
            <CardHeader>
              <CardTitle>
                {bookmark.item.type === "diamond"
                  ? bookmark.item.item_no
                  : bookmark.item.description}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-10">
        <h1 className="text-center font-heading text-4xl font-bold">
          Bookmarks (CSR)
        </h1>
        <BookmarksClient />
      </div>
    </div>
  )
}
