import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [
    "./src/index.ts",
    "./src/components/!(*.stories).tsx",
    "./src/providers/!(*.stories).tsx",
    "./src/utils/index.ts",
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
