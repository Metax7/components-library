import { z } from "zod";

export const propertiesParamsSchema = z.object({
  type: z.union([z.literal("jewelry"), z.literal("stone")]),
  category: z.string().optional(),
  sub_category: z.string().optional(),
});

export type PropertiesParams = z.infer<typeof propertiesParamsSchema>;
