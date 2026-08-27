import { treaty } from "@elysia/eden";
import ky from "ky";
import type { Options } from "ky";
import type { App } from "./routes";

export interface ServerSideHooks {
  getAuthToken: () => string | undefined | Promise<string | undefined>;
  setAuthToken: (token: string) => void | Promise<void>;
  removeAuthToken: () => void | Promise<void>;
}

export interface ApiClientConfig {
  baseUrl: string;
  companyId?: string | number;
  kyOptions?: Options;
  hooks?: ServerSideHooks;
}

export const createClient = (config: ApiClientConfig) => {
  const { baseUrl, kyOptions, hooks } = config;
  const url = new URL(baseUrl);

  const { hooks: customHooks, ...restKyOptions } = kyOptions || {};

  const fetcher = ky.create({
    retry: 1,
    timeout: 30000,
    throwHttpErrors: false, // Let Eden Treaty handle errors
    credentials: "include", // Enable cookie support by default
    ...restKyOptions,
    hooks: {
      ...customHooks,
      beforeRequest: [
        async ({ request }) => {
          request.headers.set("X-Requested-With", "XMLHttpRequest");

          if (hooks?.getAuthToken) {
            const token = await hooks.getAuthToken();
            if (token) {
              request.headers.set("Authorization", token);
            }
          }
        },
        ...(customHooks?.beforeRequest || []),
      ],
      afterResponse: [
        async ({ response }) => {
          if (!hooks) return;

          const actionType = response.headers.get("x-action-type");
          if (!actionType) return;

          if (response.ok) {
            if (actionType === "login" || actionType === "signUp") {
              const token = response.headers.get("authorization");
              if (token) {
                await hooks.setAuthToken(token);
              }
            } else if (actionType === "logout") {
              await hooks.removeAuthToken();
            }
          }
        },
        ...(customHooks?.afterResponse || []),
      ],
    },
  });

  return treaty<App>(url.host, { fetcher }).api;
};

export type ApiClient = ReturnType<typeof createClient>;
