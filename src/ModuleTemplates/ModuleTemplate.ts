import { resolve } from "path"
import { writeFileSync, mkdirSync, existsSync } from "fs"

// Config
import Config from "../Config"

// Helpers
import { ModuleHelper } from "./Helpers"

// Types
import type { ModuleExtension } from "./types"

export default abstract class ModuleTemplate {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected abstract get name(): string

    // ------------------------------------------------------------------------

    protected abstract get path(): string

    // ------------------------------------------------------------------------

    protected get ext(): ModuleExtension {
        return Config.defaultExt
    }

    // ------------------------------------------------------------------------

    protected get AlreadyExistsError(): [typeof Error, any[]] {
        return [Error, []]
    }

    // Privates ---------------------------------------------------------------
    private get filePath(): string {
        return resolve(this.path, this.name + this.ext)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public create(): void {
        this.throwIfExists()
        if (!existsSync(this.path)) mkdirSync(this.path, { recursive: true })
        writeFileSync(this.filePath, this.content())
    }

    // Protecteds -------------------------------------------------------------
    protected abstract content(): string

    // ------------------------------------------------------------------------

    protected indent(str: string, spaces: number = 4): string {
        return ModuleHelper.indent(str, spaces)
    }

    // ------------------------------------------------------------------------

    protected indentMany(parts: (string | [string, number | undefined])[]): (
        string
    ) {
        return ModuleHelper.indentMany(parts)
    }

    // Privates ---------------------------------------------------------------
    private throwIfExists(): void {
        if (existsSync(this.filePath)) {
            const [Error, args] = this.AlreadyExistsError
            throw new Error(...args)
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static toPascalCase(...parts: string[]): string {
        return ModuleHelper.toPascalCase(...parts)
    }
}