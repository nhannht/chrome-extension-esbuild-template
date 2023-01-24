import esbuild from "esbuild";
import {exec} from "child_process";
import fs from "fs-extra";

import chokidar from "chokidar";

const watch = process.argv.includes("--watch");

const defaultScript = process.argv.includes("--default");
const content = process.argv.includes("--content");
const background = process.argv.includes("--background");
const setting = process.argv.includes("--settingComponent");

let entries = [];
if (defaultScript) {
    entries.push("src/default.jsx");
} else if (content) {
    entries.push("src/content.jsx")
} else if (background) {
    entries.push("src/background.jsx")
} else if (setting) {
    entries.push("src/setting.jsx")
}
if (entries.length === 0) {
    entries = ["src/content.jsx", "src/background.jsx", "src/setting.jsx", "src/default.jsx"];
}

const buildParams = {
    color: true,
    entryPoints: entries,
    loader: {".js": "jsx", ".json": "json", ".png": "file", ".jpeg": "file", ".jpg": "file", ".svg": "file"},
    outdir: "build",
    minify: !watch,
    format: "cjs",
    bundle: true,
    sourcemap: watch,
    logLevel: "error",
    incremental: watch,
};

const build = () => {
    console.log(`[esbuild] Cleaning build folder..`)
    try {
        fs.removeSync("build");
    } catch (err) {
        console.error(err);
    }
    console.log(`[esbuild] Copying public folder..`)
    try {
        fs.copySync("public", "build");
    } catch (err) {
        console.error(err);
    }
    console.log(`[esbuild] Building..`);
    const result = esbuild.build(buildParams).catch(() => process.exit(1));

    console.log(`[esbuild] Building tailwind..`);
    try {
        exec("npx tailwindcss -o build/tailwind.css")
    } catch (err) {
        console.error(err);
    }
    console.log(`[esbuild] Done`);
    return result;
};


if (watch) {
    (async () => {
        console.log(`[esbuild] Watching..`)
        let result;
        result = await build();
        return chokidar
            .watch(["src/**/*", "public/**/*"], {ignored: /(^|[/\\])\../, ignoreInitial: true})
            .on("all", async (event, path) => {
                if (event === "change") {
                    console.log("\n")
                    const start = new Date().getTime();
                    console.log(`[esbuild] Rebuilding `);
                    if (result.rebuild) {
                        await build()
                    }
                    const end = new Date().getTime();
                    console.log("[esbuild] Done, took " + (end - start) + "ms");
                }
            });
    })();
} else {
    const start = new Date().getTime();
    console.log("[esbuild] Start building")
    await build()
    const end = new Date().getTime();
    console.timeEnd("[esbuild] Finish, took " + (end - start) + "ms")
}