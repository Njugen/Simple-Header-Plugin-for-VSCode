
const { build } = require("esbuild");

const baseConfig = {
    bundle: true,
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
};

const extensionConfig = {
    ...baseConfig,
    platform: "node",
    mainFields: ["module", "main"],
    format: "cjs",
    entryPoints: ["./src/extension.ts"],
    outfile: "out/extension.js",
    external: ["vscode"],
};

(async () => {
    try {
        await build(extensionConfig);
        console.log("build complete");
    } catch (err) {
        process.stderr.write(err.stderr);
        process.exit(1);
    }
})();

(async () => {
    const args = process.argv.slice(2);
    try {
        if (args.includes("--watch")) {
            await build({
                ...extensionConfig,
                ...watchConfig,
            });
            await build(extensionConfig);
            console.log("[watch] build finished");
        }
    } catch (err) {
        process.stderr.write(err.stderr);
        process.exit(1);
    }
})();