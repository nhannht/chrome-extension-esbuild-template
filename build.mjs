import esbuild from "esbuild";
import {exec} from "child_process";
import fs from "fs-extra";

const isWatch = process.argv.includes("--watch");

const defaultScript = process.argv.includes("--default");
const content = process.argv.includes("--content");
const background = process.argv.includes("--background");
const setting = process.argv.includes("--settingComponent");
/**
 * ESBuild Params
 * @link https://esbuild.github.io/api/#build-api
 */
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
    minify: false,
    format: "cjs",
    bundle: true,
    sourcemap: true,
    logLevel: "error",
    incremental: false,
};

// Clean build folder
try {
    fs.removeSync("build");
} catch (err) {
    console.error(err);
}
// Copy public folder into build folder
try {
    fs.copySync("public", "build");
    // fs.copySync("src/icons", "build/icons");
} catch (err) {
    console.error(err);
}


console.log(`[esbuild] Building..`);
esbuild.build(buildParams).catch(() => process.exit(1));
try {
    exec("npx tailwindcss -o build/tailwind.css")
} catch (err) {
    console.error(err);
}
