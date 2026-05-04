import { HTTPError } from "ky"
import type { ActionDeps } from "./auth"

export const createBookmarkActions = ({ api, revalidateTag }: ActionDeps) => {
  return {
    toggleBookmark: async ({
      id,
      type,
      isBookmarked,
    }: {
      id: number
      type: "stone" | "jewelry" | "diamond"
      isBookmarked: boolean
    }) => {
      const isStone = type === "stone" || type === "diamond"
      const payload = isStone ? { stone_id: id } : { jewelry_id: id }

      try {
        if (isBookmarked) {
          await api.bookmarks.delete(payload)
        } else {
          await api.bookmarks.create(payload)
        }

        if (revalidateTag) {
          revalidateTag("diamonds")
          revalidateTag("bookmarks")
        }

        return { success: true }
      } catch (error) {
        console.error("Failed to toggle bookmark:", error)
        if (error instanceof HTTPError) {
          const body = await error.response.json().catch(() => ({}))
          return {
            success: false,
            error: body.error || error.message,
          }
        }

        return {
          success: false,
          error: "Failed to toggle bookmark. Please try again later.",
        }
      }
    },
  }
}
