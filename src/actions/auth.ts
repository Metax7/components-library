import { HTTPError } from "ky"
import { parseRailsErrors } from "../api/utils"
import type {
  ApiClient,
  LoginFormValues,
  SignupFormValues,
  User,
} from "../api"

export interface ActionDeps {
  api: ApiClient
  revalidateTag?: (tag: string) => void
}

export const createAuthActions = ({ api, revalidateTag }: ActionDeps) => {
  return {
    signIn: async (_prevState: unknown, data: LoginFormValues) => {
      try {
        const res = await api.auth.signIn(data)
        return { data: res, error: null }
      } catch (error) {
        console.error("Error signing in:", error)

        if (error instanceof HTTPError) {
          const body = await error.response.json().catch(() => ({}))
          return {
            data: null,
            error: body.error || error.message,
          }
        }

        return {
          data: null,
          error: "Something went wrong. Please try again later.",
        }
      }
    },

    signUp: async (_prevState: unknown, data: SignupFormValues) => {
      try {
        const payload = {
          full_name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password,
          password_confirmation: data.passwordConfirmation,
        }

        const res = await api.auth.signUp(payload)
        return { data: res, error: null }
      } catch (error) {
        console.error("Error signing up:", error)

        if (error instanceof HTTPError) {
          const body = await error.response.json().catch(() => ({}))
          return {
            data: null,
            error: parseRailsErrors(body),
          }
        }

        return {
          data: null,
          error: "Something went wrong. Please try again later.",
        }
      }
    },

    signOut: async (userId: NonNullable<User>["id"]) => {
      try {
        await api.auth.signOut()

        if (revalidateTag) {
          revalidateTag(`user-${userId}`)
        }

        return { error: null }
      } catch (error) {
        console.error("Error signing out:", error)

        if (error instanceof HTTPError) {
          const body = await error.response.json().catch(() => ({}))
          return {
            data: null,
            error: body.error || error.message,
          }
        }

        return {
          data: null,
          error: "Something went wrong. Please try again later.",
        }
      }
    },
  }
}
