import { parseRailsErrors } from "../api/utils";
import type {
  ApiClient,
  LoginFormValues,
  SignupFormValues,
  User,
} from "../api";

export interface ActionDeps {
  api: ApiClient;
  revalidateTag?: (tag: string) => void;
}

export const createAuthActions = ({ api, revalidateTag }: ActionDeps) => {
  return {
    signIn: async (_prevState: unknown, data: LoginFormValues) => {
      const { data: res, error } = await api.auth.login.post(data);

      if (error) {
        const serverMsg =
          (error.value as any)?.error ?? (error.value as any)?.message;
        const friendlyMsg = serverMsg ?? "Login failed";
        return { data: null, error: friendlyMsg };
      }

      return { data: res, error: null };
    },

    signUp: async (_prevState: unknown, data: SignupFormValues) => {
      const payload = {
        full_name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        password_confirmation: data.passwordConfirmation,
      };

      const { data: res, error } = await api.auth.signup.post(payload);
      if (error) {
        const body = error.value as any;
        return {
          data: null,
          error: parseRailsErrors(body) || "Signup failed",
        };
      }
      return { data: res, error: null };
    },

    signOut: async (userId: NonNullable<User>["id"]) => {
      await api.auth.logout.post();

      if (revalidateTag) {
        revalidateTag(`user-${userId}`);
      }

      return { error: null };
    },
  };
};
