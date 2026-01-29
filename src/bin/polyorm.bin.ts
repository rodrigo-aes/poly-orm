#!/usr/bin/env node
import { spawn } from "child_process"
import { fileURLToPath } from "url"
import { dirname, resolve } from "path"

spawn(
    "node",
    [
        "--import",
        "tsx",
        resolve(dirname(fileURLToPath(import.meta.url)), "../bin/cli.js"),
        ...process.argv.slice(2)
    ],
    {
        stdio: "inherit"
    }
)