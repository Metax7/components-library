"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Suspense, ViewTransition } from "react"
import { LibraryProvider } from "components-library-mtx"
import { QueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <LibraryProvider
      config={{
        router,
        enableDevtools: process.env.NODE_ENV === "development",
        queryClient,
      }}
    >
      <Suspense fallback={null}>
        <NuqsAdapter>
          <ViewTransition>{children}</ViewTransition>
        </NuqsAdapter>
      </Suspense>
    </LibraryProvider>
  )
}
