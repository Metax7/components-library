"use client";

import React, { createContext, useContext, useState } from "react";
import type { LibraryConfig } from "./types";
import { toast, Toaster } from "sonner";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HTTPError } from "ky";

const LibraryContext = createContext<LibraryConfig | null>(null);

const handleQueryError = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const status = error.response.status;

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
  const [internalQueryClient] = useState(
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
  const activeQueryClient = config.queryClient ?? internalQueryClient;

  return (
    <LibraryContext.Provider value={config}>
      <QueryClientProvider client={activeQueryClient}>
        {!config.disableToaster && <Toaster richColors />}
        {children}
        {config.enableDevtools && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </LibraryContext.Provider>
  );
};

/**
 * Hook to access the current LibraryProvider configuration.
 *
 * @throws {Error} If called outside of a `<LibraryProvider>`.
 * @returns {LibraryConfig} The library configuration object.
 */
export const useLibConfig = (): LibraryConfig => {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error("useLibConfig must be used within a LibraryProvider");
  }

  return context;
};
