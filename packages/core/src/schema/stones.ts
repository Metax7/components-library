import { z } from "zod";

export const stonesParamsSchema = z.object({
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
  stone_type: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  clarity: z.string().optional().nullable(),
  shape: z.string().optional().nullable(),
  carats_min: z.coerce.number().optional().nullable(),
  carats_max: z.coerce.number().optional().nullable(),
  price_min: z.coerce.number().optional().nullable(),
  price_max: z.coerce.number().optional().nullable(),
  lab: z.string().optional().nullable(),
  cut: z.string().optional().nullable(),
  polish: z.string().optional().nullable(),
  symmetry: z.string().optional().nullable(),
  fluorescence: z.string().optional().nullable(),
});

export type StonesParams = z.infer<typeof stonesParamsSchema>;
