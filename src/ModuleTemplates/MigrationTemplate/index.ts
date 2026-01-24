import ModuleTemplate from "../ModuleTemplate"

// Config
import Config from "../../Config"

// Utils
import { join } from "path"

// Components
import TableMigrationImplements from "./TableMigrationImplements"

// Types
import type { EntityMetadata, DataType } from "../../Metadata"
import type { TableSchema, ActionType } from "../../DatabaseSchema"
import type { ModuleExtension } from "../types"

export default class MigrationTemplate extends ModuleTemplate {
    private readonly packageImportPath = '../../../Migrator'

    private implements: 'default' | 'sync' = 'default'
    private schema!: TableSchema
    private previous?: TableSchema
    private metadata!: EntityMetadata

    constructor(
        private dir: string,
        private action: ActionType,
        private className: string,
        private fileName: string,
        private tableName: string,
    ) {
        super()
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get name(): string {
        return this.fileName
    }

    // ------------------------------------------------------------------------

    protected get path(): string {
        return join(Config.migrationsDir, this.dir)
    }

    // ------------------------------------------------------------------------

    protected get importLine(): string {
        return `import { Migration${(
            this.shouldImportDT ? ', DataType' : ''
        )} } from "${this.packageImportPath}"`
    }

    // ------------------------------------------------------------------------

    protected get shouldImportDT(): boolean {
        return (
            this.implements === 'sync' &&
            [...this.schema, ...this.previous ?? []].some(
                ({ dataType }) => ['computed', 'json-ref'].includes(
                    (dataType as DataType).type
                )
            )
        )
    }

    // ------------------------------------------------------------------------

    protected get mainClassLine(): string {
        return `export default class ${this.className} extends Migration {`
    }

    // ------------------------------------------------------------------------

    protected get defaultCreateTableMethod(): string {
        return `this.database.createTable('${(
            this.tableName
        )}', table => {\n\n})`
    }

    // ------------------------------------------------------------------------

    protected get defaultAlterTableMethod(): string {
        return `this.database.alterTable('${this.tableName}', table => {\n\n})`
    }

    // ------------------------------------------------------------------------

    protected get defaultDropTableMethod(): string {
        return `this.database.dropTable('${this.tableName}')`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public sync(
        metadata: EntityMetadata,
        schema: TableSchema,
        previousSchema?: TableSchema,
    ): this {
        this.implements = 'sync'
        this.schema = schema
        this.previous = previousSchema
        this.metadata = metadata

        return this
    }

    // Protecteds -------------------------------------------------------------
    protected content(): string {
        switch (this.implements) {
            case "default": return this.defaultContent()
            case "sync": return this.syncContent()
        }
    }

    // Privates ---------------------------------------------------------------
    private defaultContent(): string {
        return this.indentMany([
            this.importLine,
            '#[break]',
            this.mainClassLine,
            [this.method('up'), 4],
            '#[break]',
            [this.method('down'), 4],
            '}'
        ])
    }

    // ------------------------------------------------------------------------

    private syncContent(): string {
        return this.indentMany([
            this.importLine,
            '#[break]',
            this.mainClassLine,
            [this.method('up', true), 4],
            '#[break]',
            [this.method('down', true), 4],
            '}'
        ])
    }

    // ------------------------------------------------------------------------

    private method(
        name: 'up' | 'down',
        sync: boolean = false
    ): string {
        return this.indentMany([
            `public ${name}() {`,
            [
                sync
                    ? this.syncImplement(name === 'down')
                    : this.defaultImplement(name === 'down'),
                4
            ],
            '}'
        ])
    }

    // ------------------------------------------------------------------------

    private defaultImplement(reverse: boolean = false): string {
        switch (reverse ? this.reverseAction() : this.action) {
            case "CREATE": return this.defaultCreateTableMethod
            case "ALTER": return this.defaultAlterTableMethod
            case "DROP": return this.defaultDropTableMethod

            default: throw new Error
        }
    }

    // ------------------------------------------------------------------------

    private syncImplement(reverse: boolean = false): string {
        return new TableMigrationImplements(
            this.metadata,
            reverse ? this.reverseAction() : this.action,
            this.schema,
            this.previous
        )
            .implements()
    }

    // ------------------------------------------------------------------------

    private reverseAction(): ActionType {
        switch (this.action) {
            case "CREATE": return 'DROP'
            case "DROP": return 'CREATE'

            case 'REBUILD':
            case "ALTER":
            case "NONE": return this.action
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildClassName(action: ActionType, tableName: string): (
        string
    ) {
        return this.toPascalCase(
            action.toLocaleLowerCase(),
            tableName,
            'table',
            '_' + Date.now()
        )
    }
}