import { createApiApp } from "components-library-mtx/api/routes"

const app = createApiApp({
  baseUrl: process.env.NEXT_PUBLIC_API_URL!,
  companyId: process.env.NEXT_PUBLIC_COMPANY_ID!,
})

export const GET = app.fetch
export const POST = app.fetch
export const DELETE = app.fetch
