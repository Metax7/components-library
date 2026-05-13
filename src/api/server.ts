import { createClient } from "./client";
import type { ApiClientConfig } from "./client";

export interface ServerSideHooks {
  getAuthToken: () => string | undefined | Promise<string | undefined>;
  setAuthToken: (token: string) => void | Promise<void>;
  removeAuthToken: () => void | Promise<void>;
}

export const createServerClient = (
  config: ApiClientConfig,
  hooks: ServerSideHooks,
) => {
  return createClient({
    ...config,
    kyOptions: {
      ...config.kyOptions,
      hooks: {
        ...config.kyOptions?.hooks,
        beforeRequest: [
          ...(config.kyOptions?.hooks?.beforeRequest || []),
          async ({ request }) => {
            const token = await hooks.getAuthToken();
            if (token) {
              request.headers.set("Authorization", token);
            }
          },
        ],
        afterResponse: [
          ...(config.kyOptions?.hooks?.afterResponse || []),
          async ({ request, response }) => {
            const actionType = request.headers.get("x-action-type");
            if (!actionType) return;

            switch (actionType) {
              case "login":
              case "signUp":
                if (response.ok) {
                  const token = response.headers.get("authorization");
                  if (token) {
                    await hooks.setAuthToken(token);
                  }
                }
                break;
              case "logout":
                await hooks.removeAuthToken();
                break;
            }
          },
        ],
      },
    },
  });
};
