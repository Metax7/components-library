import { type ServerSideHooks } from "../client";
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
import {
  bookmarksParamsSchema,
  jewelriesParamsSchema,
  propertiesParamsSchema,
  stonesParamsSchema,
} from "@/schema";

export interface ApiConfig {
  baseUrl: string;
  companyId: string | number;
  kyOptions?: Options;
  hooks?: ServerSideHooks;
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
    .get(
      "/jewelries",
      ({ query, authApi, companyId }) => {
        return authApi
          .get("jewelries", {
            searchParams: {
              company_id: companyId,
              ...cleanParams(query),
            },
          })
          .json<JewelryResponse>();
      },
      {
        query: jewelriesParamsSchema,
      },
    )
    .get(
      "/stones",
      ({ query, authApi, companyId }) => {
        return authApi
          .get("stones", {
            searchParams: {
              ...cleanParams(query),
              company_id: companyId,
            },
          })
          .json<StoneResponse>();
      },
      {
        query: stonesParamsSchema,
      },
    )
    .group("/properties", (app) =>
      app
        .get(
          "/jewelry",
          ({ query, authApi, companyId }) =>
            authApi
              .get(`companies/${companyId}/jewelry-properties`, {
                searchParams: cleanParams(query),
              })
              .json<JewelryProperties>(),
          {
            query: propertiesParamsSchema.omit({
              type: true,
            }),
          },
        )
        .get("/stone", ({ authApi, companyId }) =>
          authApi
            .get(`companies/${companyId}/stone-properties`)
            .json<StoneProperties>(),
        ),
    )
    .group("/bookmarks", (app) =>
      app
        .get(
          "/",
          ({ query, authApi }) => {
            return authApi
              .get("bookmarks", {
                searchParams: cleanParams(query),
              })
              .json<BookmarkResponse>();
          },
          {
            query: bookmarksParamsSchema,
          },
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
    .group("/quotes", (app) =>
      app
        .get("/", ({ query, authApi, companyId }) => {
          return authApi
            .get("quotes", {
searchParams: {
  ...cleanParams(query),
  company_id: companyId,
},
            })
            .json<QuoteResponse>();
        })
        .post(
          "/",
          async ({ body, authApi, companyId }) => {
            await authApi.post("quotes", {
              json: {
                quote: {
                  ...body,
                  company_id: companyId,
                },
              },
            });

            return { success: true };
          },
          {
            body: t.Object({
              customer_notes: t.Optional(t.String()),
              item_ids: t.Array(
                t.Object({
                  stone_id: t.Optional(t.Number()),
                  jewelry_id: t.Optional(t.Number()),
                }),
              ),
            }),
          },
        ),
    );
};

export type App = ReturnType<typeof createApiApp>;
