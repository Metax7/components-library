import { HTTPError } from "ky";
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
          const user = await api.auth.me();
          if (!user) return null;

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
          return await api.bookmarks.findMany(
            params as Parameters<typeof api.bookmarks.findMany>[0],
          );
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
          return await api.jewelries.findMany(
            params as Parameters<typeof api.jewelries.findMany>[0],
          );
        } catch (error) {
          console.error("Error getting jewelries:", error);

          if (error instanceof HTTPError) {
            const body = await error.response.json().catch(() => ({}));
            return {
              data: null,
              error: body.message || error.message,
            };
          }

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
          return await api.stones.findMany(
            params as Parameters<typeof api.stones.findMany>[0],
          );
        } catch (error) {
          console.error("Error getting diamonds:", error);

          if (error instanceof HTTPError) {
            const body = await error.response.json().catch(() => ({}));
            return {
              data: null,
              error: body.message || error.message,
            };
          }

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
          return await api.quotes.findMany(
            params as Parameters<typeof api.quotes.findMany>[0],
          );
        } catch (error) {
          console.error("Error getting quotes:", error);

          if (error instanceof HTTPError) {
            const body = await error.response.json().catch(() => ({}));
            return {
              data: null,
              error: body.message || error.message,
            };
          }

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
