"use client";

import React, {
  createContext,
  useContext,
  useState,
  lazy,
  Suspense,
} from "react";
import type { LibraryConfig } from "./types";
import { toast, Toaster } from "sonner";
import { HTTPError } from "ky";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((mod) => ({
    default: mod.ReactQueryDevtools,
  })),
);

const LibraryContext = createContext<LibraryConfig | null>(null);

const handleQueryError = async (error: unknown, ..._rest: unknown[]) => {
  if (error instanceof HTTPError) {
    const status = error.response.status;

    // Skip transient errors and SSR/CSR mismatches
    if ([408, 425, 429, 502, 503, 504].includes(status)) return;
    if (status >= 500 && status !== 500) return;

    if (status === 422) {
      try {
        const data = await error.response.clone().json();
        const message = data.errors
          ? Array.isArray(data.errors)
            ? data.errors.join(", ")
            : Object.values(data.errors).flat().join(", ")
          : data.error || data.message || "Validation error";
        return toast.error(`Validation error: ${message}`);
      } catch {
        return toast.error("Validation error occurred");
      }
    }

    if (status === 401) {
      try {
        const data = await error.response.clone().json();
        const message = data.error || data.message || "Unauthorized access";
        return toast.error(`Unauthorized: ${message}`);
      } catch {
        return toast.error("Unauthorized: Please sign in again");
      }
    }

    if (status === 500) {
      return toast.error("Internal server error. We are already fixing it!");
    }
  }

  // Suppress non-actionable transient errors from background queries
  if (error instanceof Error) {
    return toast.error(error.message || "Something went wrong");
  }

  toast.error("Something went wrong");
};

export const LibraryProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: LibraryConfig;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: handleQueryError,
        }),
        queryCache: new QueryCache({
          onError: handleQueryError,
        }),
      }),
  );

  return (
    <LibraryContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        {children}
        {config.enableDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </LibraryContext.Provider>
  );
};

export const useLibConfig = (): LibraryConfig => {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error("useLibraryConfig must be used within a LibraryProvider");
  }

  return context;
};
