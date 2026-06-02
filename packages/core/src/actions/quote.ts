import type { ActionDeps } from "./auth";

export const createQuoteActions = ({ api, revalidateTag }: ActionDeps) => {
  return {
    createQuote: async ({
      type,
      ids,
      notes,
    }: {
      type: "stone" | "jewelry" | "diamond";
      ids: number[];
      notes?: string;
    }) => {
      const isStone = type === "stone" || type === "diamond";
      const quoteItems = ids.map((id) =>
        isStone ? { stone_id: id } : { jewelry_id: id },
      );

      const { error } = await api.quotes.post({
        customer_notes: notes,
        item_ids: quoteItems,
      });

      if (error) {
        const body = error.value as any;

        return {
          success: false,
          error: body?.error || body?.message || "Failed to request a quote",
        };
      }

      if (revalidateTag) {
        revalidateTag("quotes");
      }

      return {
        success: true,
      };
    },
  };
};
