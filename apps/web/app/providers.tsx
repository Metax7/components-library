"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense, ViewTransition } from "react"
import { defineConfig, LibraryProvider } from "components-library-mtx"
import { useRouter } from "next/navigation"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const config = defineConfig({
    router,
    enableDevtools: process.env.NODE_ENV === "development",
  })

  return (
    <LibraryProvider config={config}>
      <Suspense fallback={null}>
        <NuqsAdapter>
          <ViewTransition>{children}</ViewTransition>
        </NuqsAdapter>
      </Suspense>
    </LibraryProvider>
  )
}
