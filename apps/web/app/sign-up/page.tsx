import { SignupForm } from "@/components/signup-form"
import { getSession } from "@/lib/wdpro/dal"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  if (await getSession()) {
    redirect("/")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
