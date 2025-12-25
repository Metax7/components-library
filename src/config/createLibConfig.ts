import type { LibraryConfig } from "@/providers/types";

export const createLibConfig = (config: LibraryConfig): LibraryConfig => {
  return {
    theme: "light",
    rippleEffect: true,
    components: {
      Link: config.components.Link || "a",
      Image: config.components.Image || "img",
    },
    router: config.router,
  };
};
