"use client";

import React, { createContext, useContext, useState } from "react";
import type { LibraryConfig } from "./types";
import { toast, Toaster } from "sonner";
import { HTTPError } from "ky";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const LibraryContext = createContext<LibraryConfig | null>(null);

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
          onError: async (error) => {
            if (error instanceof HTTPError) {
              const status = error.response.status;

              if (status === 422) {
                const data = await error.response.json();
                const message = data.errors
                  ? Object.values(data.errors).flat().join(", ")
                  : "Validation error";
                return toast.error(`Validation error: ${message}`);
              }

              if (status === 401) {
                const data = await error.response.json();
                const message = data.errors
                  ? Object.values(data.errors).flat().join(", ")
                  : "Unauthorized error";

                return toast.error(`Unauthorized error: ${message}`);
              }

              if (status === 500) {
                return toast.error(
                  "Internal server error. We are already fixing it!",
                );
              }
            }

            toast.error(error.message || "Something went wrong");
          },
        }),
        queryCache: new QueryCache({
          onError: async (error) => {
            if (error instanceof HTTPError) {
              const status = error.response.status;

              if (status === 422) {
                const data = await error.response.json();
                const message = data.errors
                  ? Object.values(data.errors).flat().join(", ")
                  : "Validation error";
                return toast.error(`Validation error: ${message}`);
              }

              if (status === 401) {
                const data = await error.response.json();
                const message = data.errors
                  ? Object.values(data.errors).flat().join(", ")
                  : "Unauthorized error";

                return toast.error(`Unauthorized error: ${message}`);
              }

              if (status === 500) {
                return toast.error(
                  "Internal server error. We are already fixing it!",
                );
              }
            }

            toast.error(error.message || "Something went wrong");
          },
        }),
      }),
  );

  return (
    <LibraryContext.Provider value={config}>
      <QueryClientProvider client={queryClient}>
        <Toaster richColors />
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
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
