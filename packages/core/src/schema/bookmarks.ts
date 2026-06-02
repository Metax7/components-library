import { z } from "zod";

export const bookmarksParamsSchema = z.object({
  sort_by: z.string().optional().nullable(),
  sort_dir: z
    .union([z.literal("asc"), z.literal("desc")])
    .optional()
    .nullable(),
});

export type BookmarksParams = z.infer<typeof bookmarksParamsSchema>;
