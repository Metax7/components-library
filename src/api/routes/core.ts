import Elysia from "elysia";
import type { ApiConfig } from ".";
import ky from "ky";

/**
 * CORE PLUGIN: Handles basic API setup and Auth Token resolution
 */
export const corePlugin = (config: ApiConfig) =>
  new Elysia({ name: "core" })
    .decorate("companyId", config.companyId)
    .decorate(
      "api",
      ky.create({
        prefix: config.baseUrl,
        retry: 1,
        timeout: 30000,
        hooks: {
          beforeRequest: [
            ({ request }) =>
              request.headers.set("X-Requested-With", "XMLHttpRequest"),
          ],
        },
        ...config.kyOptions,
      }),
    )
    .derive({ as: "global" }, ({ api, cookie: { auth_token }, headers }) => {
      // Resolve token directly in derive to ensure it's fresh and available for authApi
      const token = (auth_token?.value || headers["authorization"]) as
        | string
        | undefined;

      if (token) {
        console.log(
          `[Elysia Core] Token found (${auth_token?.value ? "cookie" : "header"}). Extending API.`,
        );
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
