import ky from "ky";
import type { Options } from "ky";
import type {
  JewelryResponse,
  User,
  StoneResponse,
  BookmarkResponse,
  JewelryProperties,
  StoneProperties,
  QuoteResponse,
  LoginFormValues,
} from "./types";
import { cleanParams } from "./utils";

export interface ApiConfig {
  baseUrl: string;
  companyId: string | number;
  kyOptions?: Options;
}

type SearchParams = Record<string, string | number | boolean | undefined>;

export const createClient = (config: ApiConfig) => {
  const { baseUrl, companyId, kyOptions } = config;

  const api = ky.create({
    prefix: baseUrl,
    retry: 1,
    hooks: {
      beforeRequest: [
        ({ request }) => {
          request.headers.set("X-Requested-With", "XMLHttpRequest");
        },
      ],
    },
    ...kyOptions,
  });

  const client = {
    raw: api,
    jewelries: {
      findMany: (searchParams?: SearchParams) => {
        const cleanedParams = cleanParams(searchParams);

        return api
          .get("jewelries", {
            searchParams: {
              company_id: companyId,
              ...cleanedParams,
            },
          })
          .json<JewelryResponse>();
      },
    },

    stones: {
      findMany: (searchParams?: SearchParams) => {
        const cleanedParams = cleanParams(searchParams);

        return api
          .get("stones", {
            searchParams: {
              company_id: companyId,
              ...cleanedParams,
            },
          })
          .json<StoneResponse>();
      },
    },

    properties: {
      jewelryProperties: (params?: {
        category?: string;
        sub_category?: string;
      }) => {
        return api
          .get(`companies/${companyId}/jewelry-properties`, {
            searchParams: params,
          })
          .json<JewelryProperties>();
      },

      stoneProperties: () => {
        return api
          .get(`companies/${companyId}/stone-properties`)
          .json<StoneProperties>();
      },
    },

    bookmarks: {
      findMany: (searchParams?: SearchParams) => {
        const cleanedParams = cleanParams(searchParams);

        return api
          .get("bookmarks", { searchParams: cleanedParams })
          .json<BookmarkResponse>();
      },
      create: (data: { stone_id?: number; jewelry_id?: number }) => {
        return api.post("bookmarks", { json: data }).json();
      },
      delete: (data: { stone_id?: number; jewelry_id?: number }) => {
        return api.delete("bookmarks/0", { json: data });
      },
    },

    quotes: {
      findMany: (searchParams?: SearchParams) => {
        const cleanedParams = cleanParams(searchParams);

        return api
          .get("quotes", {
            searchParams: {
              company_id: companyId,
              ...cleanedParams,
            },
          })
          .json<QuoteResponse>();
      },
    },

    auth: {
      me: () => api.get("profile").json<User | null>(),

      signOut: () =>
        api.delete("logout", { headers: { "x-action-type": "logout" } }),

      signIn: (data: LoginFormValues) =>
        api
          .post("login", {
            json: {
              user: {
                company_id: companyId,
                ...data,
              },
            },
            headers: { "x-action-type": "login" },
          })
          .json<User>(),

      signUp: (data: {
        full_name: string;
        email: string;
        password: string;
        password_confirmation: string;
      }) =>
        api
          .post("signup", {
            json: {
              user: {
                company_id: companyId,
                ...data,
              },
            },
            headers: { "x-action-type": "signUp" },
          })
          .json<User>(),
    },
  };

  return client;
};

export type ApiClient = ReturnType<typeof createClient>;
