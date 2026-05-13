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
import { createClient, type ApiClient } from "../api";
import type { Dal } from "../dal";
import { useLibConfig } from "@/providers/LibraryProvider";

export interface BookmarksParams {
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

export interface JewelriesParams {
  company_id?: number | null;
  page?: number | null;
  per_page?: number | null;
  sort_by?: string | null;
  sort_dir?: "asc" | "desc" | null;
  item_no?: string | null;
  description?: string | null;
  category?: string | null;
  sub_category?: string | null;
  certified_only?: boolean | null;
  only_diamonds?: boolean | null;
  only_gemstones?: boolean | null;
  only_fancy_diamonds?: boolean | null;
  stone_type?: string | null;
  stone_color?: string | null;
  stone_shape?: string | null;
  metal_type?: string | null;
  metal_color?: string | null;
  metal_karat?: string | null;
  metal_weight_min?: number | null;
  metal_weight_max?: number | null;
  on_hand?: boolean | null;
  size?: string | null;
  gender?: string | null;
  design?: string | null;
  model?: string | null;
  style?: string | null;
  price_min?: number | null;
  price_max?: number | null;
}

export interface StonesParams {
  company_id?: number | null;
  page?: number | null;
  per_page?: number | null;
  sort_by?: string | null;
  sort_dir?: "asc" | "desc" | null;
  item_no?: string | null;
  description?: string | null;
  stone_type?: string | null;
  color?: string | null;
  clarity?: string | null;
  shape?: string | null;
  carats_min?: number | null;
  carats_max?: number | null;
  price_min?: number | null;
  price_max?: number | null;
  lab?: string | null;
  cut?: string | null;
  polish?: string | null;
  symmetry?: string | null;
  fluorescence?: string | null;
}

export interface PropertiesParams {
  type: "jewelry" | "stone";
  category?: string;
  sub_category?: string;
}

export interface QuotesParams {
  status?: string | null;
  search?: string | null;
  sort_by?: string | null;
  sort_dir?: "asc" | "desc" | null;
  page?: number | null;
  per_page?: number | null;
}

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
          return [
            "bookmarks",
            (options as { resource: "bookmarks"; params?: BookmarksParams })
              .params,
          ];
        case "jewelries":
          return [
            "jewelries",
            (options as { resource: "jewelries"; params?: JewelriesParams })
              .params,
          ];
        case "stones":
          return [
            "stones",
            (options as { resource: "stones"; params?: StonesParams }).params,
          ];
        case "properties": {
          const { type, ...params } = (
            options as { resource: "properties"; params: PropertiesParams }
          ).params;
          return ["properties", `${type}-properties`, params];
        }
        case "quotes": {
          return [
            "quotes",
            (options as { resource: "quotes"; params?: QuotesParams }).params,
          ];
        }
      }
    })();

    const queryFn = async (): Promise<InferData<T>> => {
      switch (resource) {
        case "session":
          return (await api.auth.me.get()).data as InferData<T>;

        case "bookmarks": {
          const { params } = options as {
            resource: "bookmarks";
            params?: BookmarksParams;
          };

          return (
            await api.bookmarks.get({
              query: params as any,
            })
          ).data as InferData<T>;
        }

        case "jewelries": {
          const { params } = options as {
            resource: "jewelries";
            params?: JewelriesParams;
          };
          const { data, error } = await api.jewelries.get({
            query: params as any,
          });

          if (error) throw new Error(error.value as string);
          return data as InferData<T>;
        }

        case "stones": {
          const { params } = options as {
            resource: "stones";
            params?: StonesParams;
          };
          const { data, error } = await api.stones.get({
            query: params as any,
          });
          if (error) throw new Error(error.value as string);
          return data as InferData<T>;
        }

        case "properties": {
          const { type, category, sub_category } = (
            options as { resource: "properties"; params: PropertiesParams }
          ).params;

          if (type === "jewelry") {
            const { data } = await api.properties.jewelry.get({
              query: { category, sub_category } as any,
            });
            return data as InferData<T>;
          } else {
            const { data } = await api.properties.stone.get();
            return data as InferData<T>;
          }
        }

        case "quotes": {
          const { params } = options as {
            resource: "quotes";
            params?: QuotesParams;
          };
          const { data, error } = await api.quotes.get({
            query: params as any,
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
