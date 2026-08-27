import type { ApiClient } from "../api";
import type {
  JewelriesParams,
  StonesParams,
  BookmarksParams,
  QuotesParams,
} from "@/schema";

export interface DalDeps {
  api: ApiClient;
  cacheLife?: (profile: string) => void;
  cacheTag?: (...tags: string[]) => void;
}

export type DalResult<T> = T | { data: null; error: string };

export const createDal = ({ api, cacheLife, cacheTag }: DalDeps) => {
  const getCurrentUser = async () => {
    if (cacheLife) cacheLife("hours");

    try {
      const { data: user, error } = await api.auth.me.get();
      if (error || !user) return null;

      if (cacheTag) {
        cacheTag(`user-${user.id}`, "users");
      }

      return user;
    } catch {
      return null;
    }
  };

  const isAuthenticated = async () => {
    const user = await getCurrentUser();
    return !!user;
  };

  const executeQuery = async <T>(
    tags: string | string[],
    fetcher: () => Promise<{ data: T | null; error: any }>,
  ): Promise<DalResult<T>> => {
    if (cacheLife) cacheLife("hours");
    if (cacheTag) {
      if (Array.isArray(tags)) {
        cacheTag(...tags);
      } else {
        cacheTag(tags);
      }
    }

    try {
      const { data, error } = await fetcher();

      if (error) {
        console.error(`Error getting ${tags}:`, error.value);
        const body = error.value as any;
        return {
          data: null,
          error:
            body?.message ||
            body?.error ||
            "Something went wrong. Please try again later.",
        };
      }

      return data as T;
    } catch (error) {
      console.error(`Error getting ${tags}:`, error);
      return {
        data: null,
        error: "Something went wrong. Please try again later.",
      };
    }
  };

  return {
    auth: {
      getCurrentUser,
      isAuthenticated,
    },

    bookmarks: {
      findMany: async (params?: BookmarksParams) => {
        // Bookmarks returns null on error per existing requirement
        if (cacheLife) cacheLife("hours");
        if (cacheTag) cacheTag("bookmarks");

        try {
          const { data, error } = await api.bookmarks.get({
            query: params as any,
          });
          if (error) {
            console.error(error.value);
            return null;
          }
          return data;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    },

    jewelries: {
      findMany: async (params?: JewelriesParams) => {
        return executeQuery("jewelries", () =>
          api.jewelries.get({ query: params as any }),
        );
      },
    },

    stones: {
      findMany: async (params?: StonesParams) => {
        return executeQuery(["stones", "diamonds"], () =>
          api.stones.get({ query: params as any }),
        );
      },
    },

    quotes: {
      findMany: async (params?: QuotesParams) => {
        return executeQuery("quotes", () =>
          api.quotes.get({ query: params as any }),
        );
      },
    },
  };
};

export type Dal = ReturnType<typeof createDal>;
