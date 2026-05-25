import { redirect } from "next/navigation"
import PageClient from "./page.client"
import { getSession } from "@/lib/wdpro/dal"

export default async function page() {
  const user = await getSession()

  if (!user) {
    redirect("/sign-in")
  }

  return <PageClient />
}
