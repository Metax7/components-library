import { t } from "elysia";
import type { User } from "../types";
import { setResponseCookie } from "../utils";
import { corePlugin } from "./core";
import type { ApiConfig } from ".";

/**
 * AUTH ROUTES: Login, Signup, Logout
 */
export const authRoutes = (config: ApiConfig) =>
  corePlugin(config).group("/auth", (app) =>
    app
      .post(
        "/login",
        async ({ body, api, companyId, cookie: { auth_token }, set }) => {
          const response = await api.post("login", {
            json: { user: { ...body, company_id: companyId } },
            headers: { "x-action-type": "login" },
          });

          const user = await response.json<User>();
          const token = response.headers.get("authorization");

          if (token) {
            set.headers["authorization"] = token;
            set.headers["x-action-type"] = "login";
            setResponseCookie(auth_token, token);

            if (config.hooks?.setAuthToken) {
              await config.hooks.setAuthToken(token);
            }
          }
          return user;
        },
        {
          body: t.Object({ email: t.String(), password: t.String() }),
        },
      )
      .post(
        "/signup",
        async ({ body, api, companyId, cookie: { auth_token }, set }) => {
          const response = await api.post("signup", {
            json: { user: { ...body, company_id: companyId } },
            headers: { "x-action-type": "signUp" },
          });

          const user = await response.json<User>();
          const token = response.headers.get("authorization");

          if (token) {
            set.headers["authorization"] = token;
            set.headers["x-action-type"] = "signUp";
            setResponseCookie(auth_token, token);

            if (config.hooks?.setAuthToken) {
              await config.hooks.setAuthToken(token);
            }
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
      .get("/me", async ({ authApi, token }) => {
        try {
          const user = await authApi.get("profile").json<User>();
          return user;
        } catch (e: any) {
          return null;
        }
      })
      .post("/logout", async ({ authApi, cookie: { auth_token }, set }) => {
        await authApi.delete("logout", {
          headers: { "x-action-type": "logout" },
        });
        set.headers["x-action-type"] = "logout";
        auth_token?.remove();

        if (config.hooks?.removeAuthToken) {
          await config.hooks.removeAuthToken();
        }

        return { success: true };
      }),
  );
