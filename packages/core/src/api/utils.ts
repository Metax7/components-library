export type RailsError = string | string[] | null;

/**
 * Strips `undefined` and `null` values from a parameter object.
 */
export const cleanParams = (searchParams?: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(searchParams || {}).filter(
      ([, v]) => v !== undefined && v !== null,
    ),
  ) as Record<string, string | number | boolean>;
};

/**
 * Normalizes varied Rails/Devise error payloads into a string or array of strings.
 */
export const parseRailsErrors = (data: unknown): RailsError => {
  if (!data) return "An unexpected error occurred";

  if (Array.isArray(data.errors || data.error)) {
    return data.errors || data.error;
  }

  if (
    (data.errors || data.error) &&
    typeof (data.errors || data.error) === "object"
  ) {
    return Object.entries(data.errors || data.error).flatMap(
      ([field, messages]) => {
        const msgs = Array.isArray(messages) ? messages : [messages];
        return msgs.map((m) => `${field} ${m}`);
      },
    );
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  return data.message || "Something went wrong";
};

/**
 * Sets the authentication token cookie for server-side requests.
 */
export const setResponseCookie = (
  auth_token: unknown,
  token: string,
  options: { maxAge?: number; path?: string } = {},
) => {
  if (!auth_token) return;

  auth_token.value = token;
  auth_token.maxAge = options.maxAge ?? 60 * 60 * 24 * 7;
  auth_token.path = options.path ?? "/";
  auth_token.httpOnly = true;
  auth_token.secure =
    typeof process !== "undefined" && process.env.NODE_ENV === "production";
  auth_token.sameSite = "lax";
};
