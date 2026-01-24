import ModuleTemplate from "../ModuleTemplate"

export default class ConfigFileTemplate extends ModuleTemplate {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get name(): string {
        return 'poly-orm.config'
    }

    // ------------------------------------------------------------------------

    protected get path(): string {
        return '.'
    }

    // Privates ---------------------------------------------------------------
    private get importTypeLine(): string {
        return 'import type { PolyORMConfig } from "poly-orm"'
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected content(): string {
        return this.indentMany([
            this.importTypeLine,
            '#[break]',
            'const polyORMConfig: PolyORMConfig = {',
            ['createConnections: async () => {', 4],
            '#[break]',
            ['},', 4],
            ['default: {', 4],
            ['ext: \'.ts\',', 8],
            ['},', 4],
            ['migrations: {', 4],
            ['dir: \'./migrations\',', 8],
            ['ext: \'.ts\'', 8],
            ['},', 4],
            '}',
            '#[break]',
            'export default polyORMConfig'
        ])
    }
}