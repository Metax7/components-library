import { Elysia, t } from "elysia";
import { HTTPError, type Options } from "ky";
import type {
  JewelryResponse,
  StoneResponse,
  BookmarkResponse,
  JewelryProperties,
  StoneProperties,
  QuoteResponse,
} from "../types";
import { cleanParams, parseRailsErrors } from "../utils";
import { authRoutes } from "./auth";

export interface ApiConfig {
  baseUrl: string;
  companyId: string | number;
  kyOptions?: Options;
}

/**
 * MAIN APP FACTORY
 */
export const createApiApp = (config: ApiConfig) => {
  return new Elysia({ prefix: "/api" })
    .error({ HTTPError })
    .onError(async ({ error, set, code }) => {
      if (code === "HTTPError") {
        set.status = error.response.status;
        try {
          return await error.response.json();
        } catch {
          return { error: parseRailsErrors(error.data) };
        }
      }
    })
    .use(authRoutes(config))
    .get("/jewelries", ({ query, authApi, companyId }) => {
      return authApi
        .get("jewelries", {
          searchParams: {
            company_id: companyId,
            ...cleanParams(query as Record<string, any>),
          },
        })
        .json<JewelryResponse>();
    })
    .get("/stones", ({ query, authApi, companyId }) => {
      return authApi
        .get("stones", {
          searchParams: {
            company_id: companyId,
            ...cleanParams(query as Record<string, any>),
          },
        })
        .json<StoneResponse>();
    })
    .group("/properties", (app) =>
      app
        .get("/jewelry", ({ query, authApi, companyId }) =>
          authApi
            .get(`companies/${companyId}/jewelry-properties`, {
              searchParams: query as Record<string, any>,
            })
            .json<JewelryProperties>(),
        )
        .get("/stone", ({ authApi, companyId }) =>
          authApi
            .get(`companies/${companyId}/stone-properties`)
            .json<StoneProperties>(),
        ),
    )
    .group("/bookmarks", (app) =>
      app
        .get("/", ({ query, authApi }) =>
          authApi
            .get("bookmarks", {
              searchParams: cleanParams(query as Record<string, any>),
            })
            .json<BookmarkResponse>(),
        )
        .post(
          "/",
          async ({ body, authApi }) => {
            await authApi.post("bookmarks", { json: body });

            return { success: true };
          },
          {
            body: t.Object({
              stone_id: t.Optional(t.Number()),
              jewelry_id: t.Optional(t.Number()),
            }),
          },
        )
        .delete(
          "/",
          async ({ body, authApi }) => {
            await authApi.delete("bookmarks/0", { json: body });
            return { success: true };
          },
          {
            body: t.Object({
              stone_id: t.Optional(t.Number()),
              jewelry_id: t.Optional(t.Number()),
            }),
          },
        ),
    )
    .get("/quotes", ({ query, authApi, companyId }) => {
      return authApi
        .get("quotes", {
          searchParams: {
            company_id: companyId,
            ...cleanParams(query as Record<string, any>),
          },
        })
        .json<QuoteResponse>();
    });
};

export type App = ReturnType<typeof createApiApp>;
