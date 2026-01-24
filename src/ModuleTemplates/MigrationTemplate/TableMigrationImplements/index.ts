// Components
import ColumnMigrationImplements from "./ColumnMigrationImplements"

// Helpers
import { ModuleHelper } from "../../Helpers"

// Types
import type { EntityMetadata } from "../../../Metadata"
import type { TableSchema, ActionType } from "../../../DatabaseSchema"

export default class TableMigrationImplements {
    constructor(
        private metadata: EntityMetadata,
        private action: ActionType,
        private schema: TableSchema,
        private previous?: TableSchema,
    ) { }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    // ------------------------------------------------------------------------

    private get hasTimestamps(): boolean {
        return !!(
            this.schema.find(({ pattern }) => pattern === 'created-timestamp')
            &&
            this.schema.find(({ pattern }) => pattern === 'updated-timestamp')
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public implements(): string {
        switch (this.action) {
            case "CREATE": return ModuleHelper.indentMany([
                `this.database.createTable('${this.schema.name}', table => {`,
                [this.columns(), 4],
                '})'
            ])

            // --------------------------------------------------------------------

            case "ALTER": return ModuleHelper.indentMany([
                `this.database.alterTable('${this.schema.name}', table => {`,
                [this.columns(), 4],
                '})'
            ])

            // --------------------------------------------------------------------

            case "DROP": return (
                `this.database.dropTable('${this.schema.name}')`
            )

            default: throw new Error
        }
    }

    // Privates ---------------------------------------------------------------
    private columns(): string {
        return ModuleHelper.indentMany(
            this.schema.flatMap(column => {
                const prev = this.previous?.search(column.name)
                const [action] = column.compare(prev)

                if (action === 'NONE') return []

                return new ColumnMigrationImplements(
                    this.metadata,
                    action,
                    column,
                    prev,
                    this.hasTimestamps
                )
                    .implements()
            })
                .concat(this.dropColumns())
                .filter(line => line !== '')
        ) + (
                this.fixed()
            )
    }

    // ------------------------------------------------------------------------

    private fixed(): string {
        return this.hasTimestamps ? this.timestamps() : ''
    }

    // ------------------------------------------------------------------------

    private timestamps(): string {
        return this.hasTimestamps ? `\ntable.timestamps()` : ''
    }

    // ------------------------------------------------------------------------

    private dropColumns(): string[] {
        return this.previous
            ?.filter(({ name }) => !this.schema.search(name))
            .map(column =>
                new ColumnMigrationImplements(this.metadata, 'DROP', column)
                    .implements()
            )
            ?? []
    }
}