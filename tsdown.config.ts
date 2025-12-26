import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/components/*.tsx", "./src/providers/*.tsx"],
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
