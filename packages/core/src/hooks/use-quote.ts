import { useMutation, useQueryClient } from "@tanstack/react-query";

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
