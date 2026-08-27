import Elysia from "elysia";
import type { ApiConfig } from ".";
import ky from "ky";

/**
 * CORE PLUGIN: Handles basic API setup and Auth Token resolution
 */
export const corePlugin = (config: ApiConfig) => {
  const { hooks: customKyHooks, ...restKyOptions } = config.kyOptions || {};

  return new Elysia({ name: "core" })
    .decorate("companyId", config.companyId)
    .decorate(
      "api",
      ky.create({
        prefixUrl: config.baseUrl,
        retry: 1,
        timeout: 30000,
        ...restKyOptions,
        hooks: {
          ...customKyHooks,
          beforeRequest: [
            ({ request }) =>
              request.headers.set("X-Requested-With", "XMLHttpRequest"),
            ...(customKyHooks?.beforeRequest || []),
          ],
        },
      }),
    )
    .derive({ as: "global" }, async ({ api, cookie: { auth_token }, headers }) => {
      // Resolve token from: Cookie -> Authorization Header -> Hooks
      let token = (auth_token?.value || headers["authorization"]) as
        | string
        | undefined;

      if (!token && config.hooks?.getAuthToken) {
        token = await config.hooks.getAuthToken();
      }

      // Provide an "authorized" ky instance that automatically injects the token
      const authApi = api.extend({
        hooks: {
          beforeRequest: [
            ({ request }) => {
              if (token) {
                request.headers.set("Authorization", token);
              }
            },
          ],
        },
      });

      return { token, authApi };
    });
};
