import type { LibraryConfig } from "@/providers/types";

/**
 * Configuration builder for the library provider.
 * 
 * Merges default configuration with provided config, ensuring a complete
 * LibraryConfig object is returned. Useful for creating typed configs
 * without manually specifying all optional properties.
 * 
 * @param config - Partial configuration to merge with defaults
 * @returns Complete LibraryConfig with default values filled in
 * 
 * @example
 * ```ts
 * const config = defineConfig({ theme: "dark" });
 * // Returns { theme: "dark", rippleEffect: true, components: {...}, router: undefined }
 * ```
 */
export const defineConfig = (config: LibraryConfig): LibraryConfig => {
  const DEFAULT_CONFIG: Partial<LibraryConfig> = {
    theme: "light",
    rippleEffect: true,
    components: {
      Link: "a",
      Image: "img",
    },
  };

  return {
    ...DEFAULT_CONFIG,
    ...config,
    components: {
      ...DEFAULT_CONFIG.components,
      ...config.components,
    },
    router: config.router,
  };
};
