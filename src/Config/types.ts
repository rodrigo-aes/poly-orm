import type { ModuleExtension } from "../ModuleTemplates"

export type PolyORMConfig = {
    createConnections: () => Promise<void>

    default?: {
        ext?: ModuleExtension
    }

    migrations?: {
        dir?: string,
        ext?: ModuleExtension
    }
}