import { TableSQLBuilder } from "../../../SQLBuilders"
import ColumnSyncronizer from "./ColumnSyncronizer"

// Types
import type { PolyORMConnection } from "../../../Metadata"
import type { TableSchema } from "../../../DatabaseSchema"

export default class TableSyncronizer extends TableSQLBuilder<
    ColumnSyncronizer
> {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    protected static override get ColumnConstructor(): (
        typeof ColumnSyncronizer
    ) {
        return ColumnSyncronizer
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public async create(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async alter(connection: PolyORMConnection, schema: TableSchema) {
        await connection.query(this.alterSQL(schema))
    }

    // ------------------------------------------------------------------------

    public async drop(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public async executeAction(
        connection: PolyORMConnection,
        schema?: TableSchema
    ): Promise<void> {
        const sql = this.actionSQL(schema)
        if (sql) await connection.query(sql)
    }

    // Privates ---------------------------------------------------------------
    private actionSQL(schema?: TableSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'CREATE': return this.createSQL()
            case 'ALTER': return this.alterSQL(schema!)
        }
    }

    // ------------------------------------------------------------------------

    private alterSQL(schema: TableSchema) {
        return `ALTER TABLE ${this.name} ${this.alterColsSQL(schema)}`
    }

    // ------------------------------------------------------------------------

    private alterColsSQL(schema: TableSchema): string {
        return this
            .flatMap(
                col => col.actionSQL(schema.search(col.name)) ?? []
            )
            .join(', ')
    }
}