"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense } from "react"
import { LibraryProvider } from "components-library-mtx"
import { useRouter } from "next/navigation"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <LibraryProvider
      config={{
        router,
        enableDevtools: process.env.NODE_ENV === "development",
      }}
    >
      <Suspense fallback={null}>
        <NuqsAdapter>{children}</NuqsAdapter>
      </Suspense>
    </LibraryProvider>
  )
}
