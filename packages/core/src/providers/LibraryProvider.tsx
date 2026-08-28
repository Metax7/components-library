"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { LibraryConfig } from "./types";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const LibraryContext = createContext<LibraryConfig | null>(null);

export const LibraryProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: LibraryConfig;
}) => {
  const [internalQueryClient] = useState(() => new QueryClient());
  const activeQueryClient = config.queryClient ?? internalQueryClient;

  return (
    <LibraryContext.Provider value={config}>
      <QueryClientProvider client={activeQueryClient}>
        {!config.disableToaster && <Toaster richColors />}
        {children}
        {config.enableDevtools && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
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
