import type { ApiClient } from "../api";
import type {
  JewelriesParams,
  StonesParams,
  BookmarksParams,
  QuotesParams,
} from "../hooks/use-data";

export interface DalDeps {
  api: ApiClient;
  cacheLife?: (profile: string) => void;
  cacheTag?: (...tags: string[]) => void;
}

export const createDal = ({ api, cacheLife, cacheTag }: DalDeps) => {
  return {
    auth: {
      getCurrentUser: async () => {
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
      },
      isAuthenticated: async function () {
        const user = await this.getCurrentUser();
        return !!user;
      },
    },

    bookmarks: {
      findMany: async (params?: BookmarksParams) => {
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
        if (cacheLife) cacheLife("hours");
        if (cacheTag) cacheTag("jewelries");

        try {
          const { data, error } = await api.jewelries.get({
            query: params as any,
          });

          if (error) {
            console.error("Error getting jewelries:", error.value);
            const body = error.value as any;
            return {
              data: null,
              error: body?.message || body?.error || "Something went wrong. Please try again later.",
            };
          }

          return data;
        } catch (error) {
          console.error("Error getting jewelries:", error);
          return {
            data: null,
            error: "Something went wrong. Please try again later.",
          };
        }
      },
    },

    stones: {
      findMany: async (params?: StonesParams) => {
        if (cacheLife) cacheLife("hours");
        if (cacheTag) cacheTag("diamonds");

        try {
          const { data, error } = await api.stones.get({
            query: params as any,
          });

          if (error) {
            console.error("Error getting diamonds:", error.value);
            const body = error.value as any;
            return {
              data: null,
              error: body?.message || body?.error || "Something went wrong. Please try again later.",
            };
          }

          return data;
        } catch (error) {
          console.error("Error getting diamonds:", error);
          return {
            data: null,
            error: "Something went wrong. Please try again later.",
          };
        }
      },
    },

    quotes: {
      findMany: async (params?: QuotesParams) => {
        if (cacheLife) cacheLife("hours");
        if (cacheTag) cacheTag("quotes");

        try {
          const { data, error } = await api.quotes.get({
            query: params as any,
          });

          if (error) {
            console.error("Error getting quotes:", error.value);
            const body = error.value as any;
            return {
              data: null,
              error: body?.message || body?.error || "Something went wrong. Please try again later.",
            };
          }

          return data;
        } catch (error) {
          console.error("Error getting quotes:", error);
          return {
            data: null,
            error: "Something went wrong. Please try again later.",
          };
        }
      },
    },
  };
};

export type Dal = ReturnType<typeof createDal>;

