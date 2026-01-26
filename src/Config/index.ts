// Utils
import { resolve } from "path"
import { pathToFileURL } from "url"

// Static
import { defaultConfig } from "./Static"

// Types
import type { PolyORMConfig } from "./types"
import type { ModuleExtension } from "../ModuleTemplates"

class Config extends Map<string, any> {
    private loaded: boolean = false

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
        return resolve(this.get('migrations').baseDir)
    }

    // ------------------------------------------------------------------------

    public get migrationsExt(): ModuleExtension {
        return this.get('migrations').ext ?? this.defaultExt
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async load(): Promise<this> {
        if (!this.loaded) for (const [key, value] of (
            await this.buildConfig()
        )) (
            this.set(key, value)
        )

        this.loaded = true

        return this
    }

    // ------------------------------------------------------------------------

    private async buildConfig(): Promise<[string, any][]> {
        console.log(await this.loadConfigFile())

        return Object.entries({
            ...defaultConfig,
            ...await this.loadConfigFile()
        })
    }

    // ------------------------------------------------------------------------

    private async loadConfigFile(): Promise<PolyORMConfig | undefined> {
        try {
            await import('tsx/cjs')
            return (
                await import(
                    pathToFileURL(resolve('poly-orm.config.ts')).href
                )
            )
                .default

        } catch (_) {
            return undefined
        }
    }
}

export default new Config

export type {
    PolyORMConfig
}