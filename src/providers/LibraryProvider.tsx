import React, { createContext, useContext } from "react";
import type { LibraryConfig } from "./types";

const LibraryContext = createContext<LibraryConfig | null>(null);

export const LibraryProvider = ({
  children,
  config,
}: {
  children: React.ReactNode;
  config: LibraryConfig;
}) => {
  return (
    <LibraryContext.Provider value={config}>{children}</LibraryContext.Provider>
  );
};

export const useLibConfig = (): LibraryConfig => {
  const context = useContext(LibraryContext);

  if (context === null) {
    throw new Error("useLibraryConfig must be used within a LibraryProvider");
  }

  return context;
};
