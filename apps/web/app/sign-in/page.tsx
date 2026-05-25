import { LoginForm } from "@/components/login-form"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/wdpro/dal"

export default async function LoginPage() {
  if (await getSession()) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
