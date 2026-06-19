import Link from "next/link"
import { Suspense } from "react"
import { Spinner } from "../ui/spinner"
import UserMenu from "./UserMenu"
import { getSession } from "@/lib/wdpro/dal"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="font-heading text-2xl font-normal tracking-tight"
          >
            better<span className="font-black text-primary">WDPRO</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link href="/">Jewelry</Link>
            <Link href="/diamonds">Diamonds</Link>
          </nav>
        </div>

        <Suspense fallback={<Spinner />}>
          <User />
        </Suspense>
      </div>
    </header>
  )
}

async function User() {
  const user = await getSession()

  return (
    <div className="flex items-center space-x-2">
      <div className="max-lg:hidden">
        <UserMenu user={user} />
      </div>
      {/* <MobileMenu user={session?.user} /> */}
    </div>
  )
}
