import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to create a quote from selected items (stones or jewelries).
 * 
 * Submits the selected IDs along with optional notes and invalidates
 * the quotes cache on success.
 * 
 * @param quoteAction - Async function that performs the actual quote creation
 * @returns UseMutation hook for submitting the quote request
 * 
 * @example
 * ```ts
 * const createQuote = useQuote(async ({ ids, type, notes }) => {
 *   // API call to create quote
 * });
 * 
 * await createQuote.mutateAsync({
 *   ids: [1, 2, 3],
 *   type: "stone",
 *   notes: "For customer gift"
 * });
 * ```
 */
export function useQuote(
  quoteAction: (variables: {
    ids: number[];
    type: "stone" | "jewelry" | "diamond";
    notes?: string;
  }) => Promise<{ success: boolean; error?: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      ids: number[];
      type: "stone" | "jewelry" | "diamond";
      notes?: string;
    }) => {
      const res = await quoteAction(variables);
      if (res.error) {
        throw new Error(res.error);
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
  });
}
