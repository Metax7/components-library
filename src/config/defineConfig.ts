import type { LibraryConfig } from "@/providers/types";

const DEFAULT_CONFIG: Partial<LibraryConfig> = {
  theme: "light",
  rippleEffect: true,
  components: {
    Link: "a",
    Image: "img",
  },
};

export const defineConfig = (config: LibraryConfig): LibraryConfig => {
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
