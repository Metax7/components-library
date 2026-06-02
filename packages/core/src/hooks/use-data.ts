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
import type {
  BookmarksParams,
  JewelriesParams,
  PropertiesParams,
  QuotesParams,
  StonesParams,
} from "@/schema";

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
  quotes: QuoteResponse | null;
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

          return (
            await api.quotes.get({
              query: params,
            })
          ).data as InferData<T>;
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
