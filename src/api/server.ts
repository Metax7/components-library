import { createClient } from "./client";
import type { ApiClientConfig } from "./client";

export interface ServerSideHooks {
  getAuthToken: () => string | undefined | Promise<string | undefined>;
  setAuthToken: (token: string) => void | Promise<void>;
  removeAuthToken: () => void | Promise<void>;
}

export const createServerClient = (
  config: ApiClientConfig & { companyId?: string | number },
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

            // Automatically set x-action-type based on common auth paths
            const url = new URL(request.url);
            if (url.pathname.endsWith("/login")) {
              request.headers.set("x-action-type", "login");
            } else if (url.pathname.endsWith("/signup")) {
              request.headers.set("x-action-type", "signUp");
            } else if (url.pathname.endsWith("/logout")) {
              request.headers.set("x-action-type", "logout");
            }
          },
        ],
        afterResponse: [
          ...(config.kyOptions?.hooks?.afterResponse || []),
          async ({ request, response }) => {
            const actionType = request.headers.get("x-action-type");

            if (!response.ok) {
              try {
                const errorBody = await response.clone().text();
                console.error(`[serverApi] Error body:`, errorBody);
              } catch (e) {}
            }

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
                if (response.ok) {
                  await hooks.removeAuthToken();
                }
                break;
            }
          },
        ],
      },
    },
  });
};
