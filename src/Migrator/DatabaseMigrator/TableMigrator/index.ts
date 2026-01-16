import { TableSQLBuilder } from "../../../SQLBuilders"
import {
    ColumnSchema,
    type TableSchema,
    type ActionType
} from "../../../DatabaseSchema"

// Migrators
import ColumnMigrator from "./ColumnMigrator"

// Decorators
import { Logs } from "../../Decorators"

// Types
import type { PolyORMConnection } from "../../../Metadata"
import type DatabaseSchema from "../../../DatabaseSchema"

// Exceptions
import PolyORMException from "../../../Errors"

export default class TableMigrator extends TableSQLBuilder<ColumnMigrator> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected static override get ColumnConstructor(): typeof ColumnMigrator {
        return ColumnMigrator
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    @Logs.SQLTableOperation
    public async create(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.createSQL())
    }

    // ------------------------------------------------------------------------

    public async createIfNotExists(connection: PolyORMConnection): Promise<
        void
    > {
        await connection.query(this.createIfNotExistsSQL())
    }

    // ------------------------------------------------------------------------

    @Logs.SQLTableOperation
    public async alter(
        connection: PolyORMConnection,
        action: Omit<ActionType, 'CREATE'>
    ): Promise<void> {
        this.prepare()
        await connection.query(this.alterSQL(action))
    }

    // ------------------------------------------------------------------------

    @Logs.SQLTableOperation
    public async drop(connection: PolyORMConnection): Promise<void> {
        await connection.query(this.dropSQL())
    }

    // ------------------------------------------------------------------------

    public action(
        connection: PolyORMConnection,
        action: ActionType
    ): Promise<void> | void {
        this.prepare()
        switch (action) {
            case "CREATE": return this.create(connection)
            case "ALTER": return this.alter(connection, action)
            case "DROP": return this.drop(connection)
        }
    }

    // Privates ---------------------------------------------------------------
    private prepare(): void {
        this.actions = this.actions.map(([action, schema]) => [
            action,
            schema instanceof ColumnSchema
                ? ColumnMigrator.buildFromSchema(schema)
                : schema
        ])
    }

    // ------------------------------------------------------------------------

    private alterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return `ALTER TABLE ${this.name} ${(
                this.alterChildsSQL()
            )}`

            // ----------------------------------------------------------------

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // ------------------------------------------------------------------------

    private alterChildsSQL(): string {
        return this.actions
            .flatMap(([action, source]) =>
                this.alterColSQL(source as ColumnMigrator, action) ?? []
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private alterColSQL(
        schema: ColumnMigrator,
        action: ActionType | (
            'ADD-PK' | 'ADD-UNIQUE' | 'DROP-PK' | 'DROP-UNIQUE'
        )
    ): string | undefined {
        switch (action) {
            case "CREATE": return schema?.addSQL()

            // ----------------------------------------------------------------

            case "ALTER":
            case 'REBUILD':
            case "DROP": return schema.alterSQL(action)

            // ----------------------------------------------------------------

            case "ADD-PK": return schema.map.primary
                ? schema.addPKSQL()
                : undefined

            // ----------------------------------------------------------------

            case "ADD-UNIQUE": return schema.map.unique
                ? schema.addUniqueSQL()
                : undefined

            // ----------------------------------------------------------------

            case "DROP-PK": return schema.dropPKSQL()
            case "DROP-UNIQUE": return schema.dropUniqueSQL()

            // ----------------------------------------------------------------

            case "NONE": return ''
        }
    }

    // ------------------------------------------------------------------------

    private alterFKSQL(
        column: string,
        action: ActionType
    ): string {
        return this.findOrThrow(column).map.references!.migrateAlterSQL(action)
            ?? PolyORMException.MySQL.throwOutOfOperation(
                'CANNOT_DROP_FIELD_OR_KEY',
                this.findOrThrow(column).foreignKeyName,
                this.findOrThrow(column).name
            )
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static buildFromSchema(
        database: DatabaseSchema,
        schema: TableSchema,
    ): TableMigrator {
        const migrator = new TableMigrator(
            database,
            schema.name,
            ...schema.map(schema => ColumnMigrator.buildFromSchema(schema))
        )

        migrator.actions = schema.actions

        return migrator
    }
}

export {
    ColumnMigrator
}