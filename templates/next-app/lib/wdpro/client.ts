import { createClient, nextSync } from "components-library-mtx/api"

export const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  kyOptions: {
    credentials: "include",
  },
  hooks: nextSync(),
})
