import { z } from "zod";

export const jewelriesParamsSchema = z.object({
  company_id: z.coerce.number().optional().nullable(),
  page: z.coerce.number().optional().nullable(),
  per_page: z.coerce.number().optional().nullable(),
  sort_by: z.string().optional().nullable(),
  sort_dir: z
    .union([z.literal("asc"), z.literal("desc")])
    .optional()
    .nullable(),
  item_no: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  sub_category: z.string().optional().nullable(),
  certified_only: z.coerce.boolean().optional().nullable(),
  only_diamonds: z.coerce.boolean().optional().nullable(),
  only_gemstones: z.coerce.boolean().optional().nullable(),
  only_fancy_diamonds: z.coerce.boolean().optional().nullable(),
  stone_type: z.string().optional().nullable(),
  stone_color: z.string().optional().nullable(),
  stone_shape: z.string().optional().nullable(),
  metal_type: z.string().optional().nullable(),
  metal_color: z.string().optional().nullable(),
  metal_karat: z.string().optional().nullable(),
  metal_weight_min: z.coerce.number().optional().nullable(),
  metal_weight_max: z.coerce.number().optional().nullable(),
  on_hand: z.coerce.boolean().optional().nullable(),
  size: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  design: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  style: z.string().optional().nullable(),
  price_min: z.coerce.number().optional().nullable(),
  price_max: z.coerce.number().optional().nullable(),
});

export type JewelriesParams = z.infer<typeof jewelriesParamsSchema>;
