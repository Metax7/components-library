import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/components/!(*.stories).tsx",
    "./src/providers/!(*.stories).tsx",
    "./src/utils/index.ts",
    "./src/api/index.ts",
    "./src/actions/index.ts",
    "./src/hooks/index.ts",
    "./src/dal/index.ts",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  unbundle: true,
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
  ],
  platform: "browser",
});
