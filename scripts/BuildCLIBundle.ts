import { build } from "esbuild"

export default () => build({
    entryPoints: ["src/bin/cli.ts"],
    outfile: "lib/bin/cli.js",
    format: "esm",
    platform: "node",
    bundle: true,
    sourcemap: true,
    target: "node18"
})