export interface LibraryConfig {
  theme?: "light" | "dark";
  rippleEffect?: boolean;
  components: Components;
  router: Router;
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
