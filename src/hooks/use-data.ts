import { useQuery } from "@tanstack/react-query";
import type {
  BookmarkResponse,
  JewelryResponse,
  QuoteResponse,
  StoneResponse,
  User,
  JewelryProperties,
  StoneProperties,
} from "../api/types";
import { type ApiClient } from "../api";
import { z } from "zod";

export const bookmarksParamsSchema = z.object({
  sort_by: z.string().optional().nullable(),
  sort_dir: z
    .union([z.literal("asc"), z.literal("desc")])
    .optional()
    .nullable(),
});

export type BookmarksParams = z.infer<typeof bookmarksParamsSchema>;

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

export const propertiesParamsSchema = z.object({
  type: z.union([z.literal("jewelry"), z.literal("stone")]),
  category: z.string().optional(),
  sub_category: z.string().optional(),
});

export type PropertiesParams = z.infer<typeof propertiesParamsSchema>;

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

export type DataOptions =
  | { resource: "session" }
  | { resource: "bookmarks"; params?: BookmarksParams }
  | { resource: "jewelries"; params?: JewelriesParams }
  | { resource: "stones"; params?: StonesParams }
  | { resource: "properties"; params: PropertiesParams }
  | { resource: "quotes"; params?: QuotesParams };

export interface ResourceReturnMap {
  session: User | null;
  bookmarks: BookmarkResponse | null;
  jewelries: JewelryResponse | { data: null; error: string };
  stones: StoneResponse | { data: null; error: string };
  properties: JewelryProperties | StoneProperties;
  quotes: QuoteResponse | { data: null; error: string };
}

export type InferData<T extends DataOptions> = ResourceReturnMap[T["resource"]];

export interface UseDataDeps {
  api: ApiClient;
}

export function createUseData(deps: UseDataDeps) {
  const { api } = deps;

  return function useData<T extends DataOptions>(
    options: T,
  ): ReturnType<typeof useQuery<InferData<T>>> {
    const { resource } = options;

    const queryKey = (() => {
      switch (resource) {
        case "session":
          return ["session"];
        case "bookmarks":
          return ["bookmarks", options.params];
        case "jewelries":
          return ["jewelries", options.params];
        case "stones":
          return ["stones", options.params];
        case "properties": {
          const { type, ...params } = options.params;
          return ["properties", `${type}-properties`, params];
        }
        case "quotes": {
          return ["quotes", options.params];
        }
      }
    })();

    const queryFn = async (): Promise<InferData<T>> => {
      switch (resource) {
        case "session":
          return (await api.auth.me.get()).data as InferData<T>;

        case "bookmarks": {
          const { params } = options;

          return (
            await api.bookmarks.get({
              query: params,
            })
          ).data as InferData<T>;
        }

        case "jewelries": {
          const { params } = options;

          const { data, error } = await api.jewelries.get({
            query: params,
          });

          if (error) throw new Error(error.value as any);

          return data as InferData<T>;
        }

        case "stones": {
          const { params } = options;

          const { data, error } = await api.stones.get({
            query: params,
          });

          if (error) throw new Error(error.value as any);
          return data as InferData<T>;
        }

        case "properties": {
          const { type, category, sub_category } = options.params;

          if (type === "jewelry") {
            const { data } = await api.properties.jewelry.get({
              query: { category, sub_category },
            });
            return data as InferData<T>;
          } else {
            const { data } = await api.properties.stone.get();
            return data as InferData<T>;
          }
        }

        case "quotes": {
          const { params } = options;

          const { data, error } = await api.quotes.get({
            query: params,
          });

          if (error) throw new Error(error.value as string);
          return data as InferData<T>;
        }
      }
    };

    const staleTime = 1000 * 60 * 5;
    const gcTime = resource === "session" ? 1000 * 60 * 10 : undefined;
    const retry = resource === "session" ? 1 : undefined;

    return useQuery<InferData<T>>({
      queryKey,
      queryFn,
      staleTime,
      ...(gcTime !== undefined && { gcTime }),
      ...(retry !== undefined && { retry }),
    }) as ReturnType<typeof useQuery<InferData<T>>>;
  };
}
