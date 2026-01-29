
import chalk from "chalk"
import { rimraf } from "rimraf";
import run from "./Run"
import buildCLIBundle from "./BuildCLIBundle"

(async () => {
    // Init ===================================================================
    console.log(chalk.yellowBright("Initializing build proccess...\n"))

    // Clean previous dist content ============================================
    console.log(chalk.cyanBright("Cleaning previous build content..."))
    await rimraf("./lib");

    // Compile typescript files ===============================================
    console.log(chalk.cyan('Compiling TypeScript modules...'))
    await run("tsc")

    // Build CLI bundle =======================================================
    console.log(chalk.cyan('Building CLI bundle...\n'))
    await buildCLIBundle()

    // Finished success =======================================================
    console.log(chalk.green('Build proccess finished SUCCESSFULLY!\n'))
})()