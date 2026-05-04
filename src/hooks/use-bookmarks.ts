import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { StoneResponse, JewelryResponse, BookmarkResponse } from "../api/types"

export function useToggleBookmark(toggleBookmarkAction: (variables: {
  id: number
  type: "stone" | "jewelry" | "diamond"
  isBookmarked: boolean
}) => Promise<{ success: boolean; error?: string }>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: {
      id: number
      type: "stone" | "jewelry" | "diamond"
      isBookmarked: boolean
    }) => {
      const res = await toggleBookmarkAction(variables)
      if (res.error) {
        throw new Error(res.error)
      }
      return res
    },
    onMutate: async ({ id, type, isBookmarked }) => {
      const isStone = type === "stone" || type === "diamond"
      const queryKeyPrefix = isStone ? "stones" : "jewelries"

      await queryClient.cancelQueries({ queryKey: [queryKeyPrefix] })
      await queryClient.cancelQueries({ queryKey: ["bookmarks"] })

      const previousData = queryClient.getQueriesData({ queryKey: [queryKeyPrefix] })
      const previousBookmarks = queryClient.getQueriesData({ queryKey: ["bookmarks"] })

      queryClient.setQueriesData(
        { queryKey: [queryKeyPrefix] },
        (old: StoneResponse | JewelryResponse | undefined) => {
          if (!old || !old.data) return old
          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id ? { ...item, is_bookmarked: !isBookmarked } : item
            ),
          } as StoneResponse | JewelryResponse
        }
      )

      if (isBookmarked) {
        queryClient.setQueriesData(
          { queryKey: ["bookmarks"] },
          (old: BookmarkResponse | undefined) => {
            if (!old || !old.data) return old
            return {
              ...old,
              data: old.data.filter((bookmark) =>
                isStone ? bookmark.stone_id !== id : bookmark.jewelry_id !== id
              ),
            }
          }
        )
      }

      return { previousData: [...previousData, ...previousBookmarks], queryKeyPrefix }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: (_data, _error, _vars, context) => {
      if (context?.queryKeyPrefix) {
        queryClient.invalidateQueries({ queryKey: [context.queryKeyPrefix] })
      }
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })
}
