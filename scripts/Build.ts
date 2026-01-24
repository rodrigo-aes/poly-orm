import { spawn } from "child_process"
import chalk from "chalk"
import { rimraf } from "rimraf";

function run(cmd: string, ...args: string[]) {
    return new Promise<void>((resolve, reject) => {
        const p = spawn(cmd, args, {
            stdio: "inherit",
            shell: true
        })

        p.on("error", reject)

        p.on("close", code => {
            if (code === 0) resolve()
            else reject(new Error(`${cmd} failed with exit code ${code}`))
        })
    })
}

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

(async () => {
    // Init ===================================================================
    console.log(chalk.yellowBright("Initializing build proccess...\n"))

    // Clean previous dist content ============================================
    console.log(chalk.cyanBright("Cleaning previous build content..."))
    await rimraf("./lib");

    // Compile typescript files ===============================================
    console.log(chalk.cyan('Compiling TypeScript modules...\n'))
    await run("tsc")

    // Double Build with CJS support ==========================================
    // if (process.argv.includes('--esm')) await compileESM()
    // if (process.argv.includes('--cjs')) await compileCJS()

    // Finished success =======================================================
    console.log(chalk.green('Build proccess finished SUCCESSFULLY!\n'))
})()