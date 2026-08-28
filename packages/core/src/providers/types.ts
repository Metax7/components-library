import type { QueryClient } from "@tanstack/react-query";

export interface LibraryConfig {
  theme?: "light" | "dark";
  rippleEffect?: boolean;
  components?: Partial<Components>;
  enableDevtools?: boolean;
  router: Router;
  queryClient?: QueryClient;
  disableToaster?: boolean;
}

export interface Components {
  Link: React.ElementType;
  Image: React.ElementType;
}

export interface Router {
  push: (url: string) => void;
  replace: (url: string) => void;
  back: () => void;
}
