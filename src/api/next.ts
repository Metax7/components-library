import type { ServerSideHooks } from "./client";

/**
 * Automatically provides server-side hooks for Next.js.
 * This helper is safe to use in both client and server environments.
 * It uses dynamic imports to avoid breaking the browser bundle.
 */
export const nextSync = (): ServerSideHooks | undefined => {
  if (typeof window !== "undefined") return undefined;

  return {
    getAuthToken: async () => {
      try {
        // @ts-ignore
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        return cookieStore.get("auth_token")?.value;
      } catch {
        return undefined;
      }
    },
    setAuthToken: async (token: string) => {
      try {
        // @ts-ignore
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        // @ts-ignore
        const isProd = typeof process !== "undefined" && process.env?.NODE_ENV === "production";

        cookieStore.set("auth_token", token, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
        });
      } catch {
        // Next.js throws if cookies().set() is called in RSC
      }
    },
    removeAuthToken: async () => {
      try {
        // @ts-ignore
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.delete("auth_token");
      } catch {
        // ignore
      }
    },
  };
};

/**
 * Helper to get Next.js headers for manual forwarding if needed.
 * Safe for browser (returns empty object).
 */
export const getNextHeaders = async () => {
  if (typeof window !== "undefined") return {};
  try {
    // @ts-ignore
    const { headers } = await import("next/headers");
    const headersList = await headers();
    const result: Record<string, string> = {};
    headersList.forEach((value: string, key: string) => {
      result[key] = value;
    });
    return result;
  } catch {
    return {};
  }
};
