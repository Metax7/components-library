import { Elysia, t } from "elysia";
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
} from "./types";
import { cleanParams, setResponseCookie } from "./utils";

export interface ApiConfig {
  baseUrl: string;
  companyId: string | number;
  kyOptions?: Options;
}

export const createApiApp = (config: ApiConfig) => {
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

  return new Elysia({ prefix: "/api" })
    .decorate("api", api)
    .decorate("companyId", companyId)
    .resolve(({ cookie: { auth_token }, headers }) => {
      return {
        getHeaders: () => {
          const headersMap: Record<string, string> = {};
          const token = auth_token?.value || headers["authorization"];

          if (token) {
            headersMap["Authorization"] = token as string;
          }
          return headersMap;
        },
      };
    })
    .get("/jewelries", async ({ query, api, companyId, getHeaders }) => {
      const cleanedParams = cleanParams(query as Record<string, any>);
      return api
        .get("jewelries", {
          searchParams: { company_id: companyId, ...cleanedParams },
          headers: getHeaders(),
        })
        .json<JewelryResponse>();
    })
    .get("/stones", async ({ query, api, companyId, getHeaders }) => {
      const cleanedParams = cleanParams(query as Record<string, any>);
      return api
        .get("stones", {
          searchParams: { company_id: companyId, ...cleanedParams },
          headers: getHeaders(),
        })
        .json<StoneResponse>();
    })
    .group("/properties", (app) =>
      app
        .get("/jewelry", async ({ query, api, companyId, getHeaders }) => {
          return api
            .get(`companies/${companyId}/jewelry-properties`, {
              searchParams: query as Record<string, any>,
              headers: getHeaders(),
            })
            .json<JewelryProperties>();
        })
        .get("/stone", async ({ api, companyId, getHeaders }) => {
          return api
            .get(`companies/${companyId}/stone-properties`, {
              headers: getHeaders(),
            })
            .json<StoneProperties>();
        }),
    )
    .group("/bookmarks", (app) =>
      app
        .get("/", async ({ query, api, getHeaders }) => {
          const cleanedParams = cleanParams(query as Record<string, any>);
          return api
            .get("bookmarks", {
              searchParams: cleanedParams,
              headers: getHeaders(),
            })
            .json<BookmarkResponse>();
        })
        .post(
          "/",
          async ({ body, api, getHeaders }) => {
            return api
              .post("bookmarks", { json: body, headers: getHeaders() })
              .json();
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
          async ({ body, api, getHeaders }) => {
            return api
              .delete("bookmarks/0", { json: body, headers: getHeaders() })
              .json();
          },
          {
            body: t.Object({
              stone_id: t.Optional(t.Number()),
              jewelry_id: t.Optional(t.Number()),
            }),
          },
        ),
    )
    .get("/quotes", async ({ query, api, companyId, getHeaders }) => {
      const cleanedParams = cleanParams(query as Record<string, any>);
      return api
        .get("quotes", {
          searchParams: { company_id: companyId, ...cleanedParams },
          headers: getHeaders(),
        })
        .json<QuoteResponse>();
    })
    .group("/auth", (app) =>
      app
        .get("/me", async ({ api, getHeaders }) => {
          try {
            return await api
              .get("profile", { headers: getHeaders() })
              .json<User>();
          } catch (e) {
            return null;
          }
        })
        .post(
          "/login",
          async ({ body, api, companyId, cookie: { auth_token }, set }) => {
            const response = await api.post("login", {
              json: {
                user: {
                  company_id: companyId,
                  ...body,
                },
              },
              headers: { "x-action-type": "login" },
            });
            const user = await response.json<User>();
            const token = response.headers.get("authorization");

            if (token) {
              set.headers["authorization"] = token;
              set.headers["x-action-type"] = "login";
              setResponseCookie(auth_token, token);
            }
            return user;
          },
          {
            body: t.Object({
              email: t.String(),
              password: t.String(),
            }),
          },
        )
        .post(
          "/signup",
          async ({ body, api, companyId, cookie: { auth_token }, set }) => {
            const response = await api.post("signup", {
              json: {
                user: {
                  company_id: companyId,
                  ...body,
                },
              },
              headers: { "x-action-type": "signUp" },
            });
            const user = await response.json<User>();
            const token = response.headers.get("authorization");

            if (token) {
              set.headers["authorization"] = token;
              set.headers["x-action-type"] = "signUp";
              setResponseCookie(auth_token, token);
            }
            return user;
          },
          {
            body: t.Object({
              full_name: t.String(),
              email: t.String(),
              password: t.String(),
              password_confirmation: t.String(),
            }),
          },
        )
        .post(
          "/logout",
          async ({ api, getHeaders, cookie: { auth_token }, set }) => {
            await api.delete("logout", {
              headers: { "x-action-type": "logout", ...getHeaders() },
            });
            set.headers["x-action-type"] = "logout";
            auth_token?.remove();
            return { success: true };
          },
        ),
    );
};

export type App = ReturnType<typeof createApiApp>;
