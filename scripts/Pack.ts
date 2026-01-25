import run from "./Run"

(async () => {
    await run("npm", "run", "build")
    await run("npm", "pack")
})()