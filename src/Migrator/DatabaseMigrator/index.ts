import DatabaseSchema, { type TableSchema } from "../../DatabaseSchema"
import TableMigrator, { ColumnMigrator } from "./TableMigrator"
import TriggersMigrator from "./TriggersMigrator"

// Decorators
import { Logs } from "../Decorators"

// Types
import type { PolyORMConnection } from "../../Metadata"

export default class DatabaseMigrator extends DatabaseSchema<TableMigrator> {
    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get TableConstructor(): typeof TableSchema {
        return TableMigrator as typeof TableSchema
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async executeActions(clear: boolean = false): Promise<void> {
        for (const [action, schema] of this.actions) (
            await (schema instanceof TableMigrator
                ? schema
                : TableMigrator.buildFromSchema(this, schema)
            )
                .action(this.connection, action)
        )

        if (clear) this.clearActions()
    }

    // ------------------------------------------------------------------------

    public async executeTriggersActions(): Promise<void> {
        return TriggersMigrator
            .buildFromSchema(this.triggers, this.connection)
            .executeActions()
    }

    // ------------------------------------------------------------------------

    @Logs.SQLTableOperation
    public async dropAll(): Promise<void> {
        for (const table of this) await table.drop(this.connection)
    }

    // ------------------------------------------------------------------------

    public clearActions(): void {
        this.actions = []
        for (const table of this) {
            for (const column of table) column.actions = []
            table.actions = []
        }
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(
        schema: DatabaseSchema,
        connection?: PolyORMConnection
    ): DatabaseMigrator {
        const migrator = new DatabaseMigrator(connection ?? schema.connection)

        migrator.push(...schema.map(
            schema => TableMigrator.buildFromSchema(migrator, schema)
        ))

        return migrator
    }
}

export {
    TableMigrator,
    ColumnMigrator
}