import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  sourcemap: true,
  minify: false,
  // The bin must be directly executable on POSIX systems.
  banner: { js: "#!/usr/bin/env node" },
});
