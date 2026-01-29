// Utils
import { resolve } from "path"
import { pathToFileURL } from "url"

// Modules
import ConfigFile from "./ConfigFile"

// Static
import { defaultConfig } from "./Static"

// Types
import type { PolyORMConfig } from "./types"
import type { ModuleExtension } from "../ModuleTemplates"

class Config extends Map<string, any> {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get createConnections(): PolyORMConfig['createConnections'] {
        return this.get('createConnections')
    }

    // ------------------------------------------------------------------------

    public get defaultExt(): ModuleExtension {
        return this.get('default').ext
    }

    // ------------------------------------------------------------------------

    public get migrationsDir(): string {
        return resolve(this.get('migrations').dir)
    }

    // ------------------------------------------------------------------------

    public get migrationsExt(): ModuleExtension {
        return this.get('migrations').ext ?? this.defaultExt
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async load(): Promise<this> {
        for (const conf of await this.getConfig()) this.set(...conf)
        return this
    }

    // ------------------------------------------------------------------------

    private async getConfig(): Promise<[string, any][]> {
        return Object.entries({ ...defaultConfig, ...await this.loadFile() })
    }

    // ------------------------------------------------------------------------

    private async loadFile(): Promise<PolyORMConfig | undefined> {
        try {
            return (await import(
                pathToFileURL(resolve("poly-orm.config.ts")).href)
            )
                .default
        }
        catch (err) {
            console.error("Failed to load config file:", err)
            return undefined
        }
    }
}

export default new Config

export type {
    PolyORMConfig
}