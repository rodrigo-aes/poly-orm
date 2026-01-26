
import chalk from "chalk"
import { rimraf } from "rimraf";
import { rename } from "node:fs/promises"
import run from "./Run"



async function compileESM() {
    console.log(chalk.cyanBright('Compiling ESM modules...'))
    await run("tsc", "-p tsconfig.esm.json")
    console.log(chalk.greenBright('ESM modules compiled successfully!'))
}

async function compileCJS() {
    console.log(chalk.cyanBright('Compiling CJS modules...'))
    await run("tsc", "-p tsconfig.cjs.json")
    console.log(chalk.greenBright('CJS modules compiled successfully!'))
}

async function compileCLI() {
    console.log(chalk.cyanBright('Compiling CLI in CommonJS...'))
    await run("tsc", "-p tsconfig.cli.json")

    // Rename cli.js to cli.cjs (CJS extension ensures CommonJS execution)
    console.log(chalk.cyanBright('Renaming CLI to .cjs format...'))
    await rename('./lib/cli.js', './lib/cli.cjs')

    console.log(chalk.greenBright('CLI compiled successfully as cli.cjs!'))
}

(async () => {
    // Init ===================================================================
    console.log(chalk.yellowBright("Initializing build proccess...\n"))

    // Clean previous dist content ============================================
    console.log(chalk.cyanBright("Cleaning previous build content..."))
    await rimraf("./lib");

    // Compile typescript files ===============================================
    console.log(chalk.cyan('Compiling TypeScript modules...\n'))
    await run("tsc")

    // Compile CLI separately in CommonJS =====================================
    console.log(chalk.cyan('\nCompiling CLI separately...\n'))
    await compileCLI()

    // Double Build with CJS support ==========================================
    // if (process.argv.includes('--esm')) await compileESM()
    // if (process.argv.includes('--cjs')) await compileCJS()

    // Finished success =======================================================
    console.log(chalk.green('Build proccess finished SUCCESSFULLY!\n'))
})()