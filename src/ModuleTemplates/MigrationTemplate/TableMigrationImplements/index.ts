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
                [this.columnsImplements(), 4],
                '})'
            ])

            case "ALTER": return ModuleHelper.indentMany([
                `this.database.alterTable('${this.schema.name}', table => {`,
                [this.columnsImplements(), 4],
                '})'
            ])

            case "DROP": return (
                `this.database.dropTable('${this.schema.name}')`
            )

            default: throw new Error
        }
    }

    // Privates ---------------------------------------------------------------
    private columnsImplements(): string {
        let implementation = ModuleHelper.indentMany(
            this.schema.flatMap(column => {
                const prevColumn = this.previous?.findColumn(column.name)
                const [action] = column.compare(prevColumn)

                if (action === 'NONE') return []

                return new ColumnMigrationImplements(
                    this.metadata,
                    action,
                    column,
                    prevColumn,
                    this.hasTimestamps
                )
                    .implements()
            })
                .concat(this.toDropColumns())
                .filter(line => line !== '')
        )

        implementation += this.addFixedImplements()

        return implementation
    }

    // ------------------------------------------------------------------------

    private addFixedImplements(): string {
        let implementation: string = ''

        if (this.hasTimestamps) implementation += this.timestampsImplement()

        return implementation
    }

    // ------------------------------------------------------------------------

    private timestampsImplement(): string {
        return this.hasTimestamps ? `\ntable.timestamps()` : ''
    }

    // ------------------------------------------------------------------------

    private toDropColumns(): string[] {
        return this.previous?.
            filter(({ name }) => !this.schema.findColumn(name))
            .map(
                column => new ColumnMigrationImplements(
                    this.metadata,
                    'DROP',
                    column,
                )
                    .implements()
            )
            ?? []
    }
}