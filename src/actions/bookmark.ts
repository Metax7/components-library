import type { ActionDeps } from "./auth";

export const createBookmarkActions = ({ api, revalidateTag }: ActionDeps) => {
  return {
    toggleBookmark: async ({
      id,
      type,
      isBookmarked,
    }: {
      id: number;
      type: "stone" | "jewelry" | "diamond";
      isBookmarked: boolean;
    }) => {
      const isStone = type === "stone" || type === "diamond";
      const payload = isStone ? { stone_id: id } : { jewelry_id: id };

      let error = null;
      if (isBookmarked) {
        const res = await api.bookmarks.delete(payload);
        error = res.error;
      } else {
        const res = await api.bookmarks.post(payload);
        error = res.error;
      }

      if (error) {
        const body = error.value as any;
        return {
          success: false,
          error: body?.error || body?.message || "Failed to toggle bookmark",
        };
      }

      if (revalidateTag) {
        revalidateTag("diamonds");
        revalidateTag("bookmarks");
        revalidateTag("jewelries");
      }

      return { success: true };
    },
  };
};
