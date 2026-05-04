/* eslint-disable @typescript-eslint/no-explicit-any */

export type RailsError = string | string[] | null

export const cleanParams = (searchParams?: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(searchParams || {}).filter(
      ([, v]) => v !== undefined && v !== null
    )
  ) as Record<string, string | number | boolean>
}

export const parseRailsErrors = (data: any): RailsError => {
  if (!data) return "An unexpected error occurred"

  if (Array.isArray(data.errors)) {
    return data.errors
  }

  if (data.errors && typeof data.errors === "object") {
    return Object.entries(data.errors).flatMap(([field, messages]) => {
      const msgs = Array.isArray(messages) ? messages : [messages]
      return msgs.map((m) => `${field} ${m}`)
    })
  }

  if (typeof data.error === "string") {
    return data.error
  }

  return data.message || "Something went wrong"
}
