"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense, useState, ViewTransition } from "react"
import { defineConfig, LibraryProvider } from "components-library-mtx"
import { QueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  )

  const config = defineConfig({
    router,
    enableDevtools: process.env.NODE_ENV === "development",
    queryClient,
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
