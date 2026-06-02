import { z } from "zod";

export const quotesParamsSchema = z.object({
  status: z.string().optional().nullable(),
  search: z.string().optional().nullable(),
  sort_by: z.string().optional().nullable(),
  sort_dir: z
    .union([z.literal("asc"), z.literal("desc")])
    .optional()
    .nullable(),
  page: z.coerce.number().optional().nullable(),
  per_page: z.coerce.number().optional().nullable(),
});

export type QuotesParams = z.infer<typeof quotesParamsSchema>;
