import { spawn } from "child_process"

export default function run(cmd: string, ...args: string[]) {
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