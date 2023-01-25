import esbuild from "esbuild";
import {exec} from "child_process";
import fs from "fs-extra";
import chalk from "chalk";
import chokidar from "chokidar";
import emoji from "node-emoji";


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
const esBuildText = chalk.blue('[esbuild] ')

function cleanBuildDir() {
    console.log(esBuildText + ' Cleaning build folder ...  ')
    try {
        fs.removeSync("build");
    } catch (err) {
        console.error(err);
    }
}

function copyPublicToBuild() {
    console.log(esBuildText + ' Copying public folder ... ')
    try {
        fs.copySync("public", "build");
    } catch (err) {
        console.error(err);
    }
}

function cleanBuild() {
    console.log(esBuildText + " Building.. ");
    return esbuild.build(buildParams).catch(() => process.exit(1));
}

function buildTailwindcss() {
    console.log(esBuildText + " Building tailwind..");
    try {
        exec("npx tailwindcss -o build/tailwind.css")
    } catch (err) {
        console.error(err);
    }
}

const build = () => {
    cleanBuildDir();
    copyPublicToBuild();
    const result = cleanBuild();

    buildTailwindcss();
    console.log(esBuildText + "Done");
    return result;
};


if (watch) {
    (async () => {
        cleanBuildDir();
        console.log(esBuildText + ` Watching.. `)
        let result;
        result = await cleanBuild()
        copyPublicToBuild();
        buildTailwindcss();
        return chokidar
            .watch(["src/**/*", "public/**/*"], {ignored: /(^|[/\\])\../, ignoreInitial: true})
            .on("all", async (event, path) => {
                if (event === "change") {
                    console.log("\n")
                    const start = new Date().getTime();
                    console.log(esBuildText + ` Rebuilding ${chalk.red.underline(path)} `);
                    if (result.rebuild) {
                        await result.rebuild();
                        buildTailwindcss();
                    }
                    const end = new Date().getTime();
                    console.log(`${esBuildText} Done, took ` + chalk.red.underline(end - start) + " ms");
                }
            });
    })();
} else {
    const start = new Date().getTime();
    console.log(esBuildText + `Start building`)
    await build();
    const end = new Date().getTime();
    console.log(esBuildText + ` Finish, took ` + chalk.red.underline(end - start) + ` ms `)
    process.exit(0);
}