// Schemas
import TableSchema from "../../../DatabaseSchema/TableSchema"
import ColumnSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema"
import ForeignKeyRefSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema/ForeignKeyRefSchema"

// SQL Builders
import ColumnSQLBuilder, {
    ForeignKeyConstraintSQLBuilder,
    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap
} from "./ColumnSQLBuilder"

// Types
import type { ActionType } from "../../../DatabaseSchema"
import type { ColumnMigrator } from "../../../Migrator/DatabaseMigrator"

// Exceptions
import PolyORMException from "../../../Errors"

export default class TableSQLBuilder<
    T extends ColumnSQLBuilder = ColumnSQLBuilder
> extends TableSchema<T> {
    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected static override get ColumnConstructor(): (
        typeof ColumnSQLBuilder
    ) {
        return ColumnSQLBuilder
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL() {
        return `CREATE TABLE ${this.name} (${this.createColumnsSQL()})`
    }

    // ------------------------------------------------------------------------

    public createIfNotExistsSQL(): string {
        return `CREATE TABLE IF NOT EXISTS ${this.name} (${(
            this.createColumnsSQL()
        )})`
    }

    // ------------------------------------------------------------------------

    public syncAlterSQL(schema: TableSchema) {
        return `ALTER TABLE ${this.name} ${this.alterColumnsSQL(schema)}`
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        return `DROP TABLE ${this.name}`
    }

    // ------------------------------------------------------------------------

    public syncActionSQL(schema?: TableSchema): string | undefined {
        switch (this.compare(schema)) {
            case 'CREATE': return this.createSQL()
            case 'ALTER': return this.syncAlterSQL(schema!)
        }
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: Omit<ActionType, 'CREATE'>): string {
        switch (action) {
            case 'ALTER': return `ALTER TABLE ${this.name} ${(
                this.migrateAlterChildsSQL()
            )}`

            case 'DROP': return this.dropSQL()
        }

        throw new Error
    }

    // Privates ---------------------------------------------------------------
    private createColumnsSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }

    // ------------------------------------------------------------------------

    private alterColumnsSQL(schema: TableSchema): string {
        return this.map(column => column.syncActionSQL(
            schema.findColumn(column.name)
        ))
            .filter(action => !!action)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private migrateAlterChildsSQL(): string {
        return this.actions.map(([action, source]) => {
            switch (true) {
                case source instanceof ColumnSchema: return (
                    this.migrateAlterColumnSQL(
                        source as ColumnMigrator,
                        action
                    )
                )

                case source instanceof ForeignKeyRefSchema: return (
                    this.migrateAlterForeignKeyConstraintSQL(
                        source.name,
                        action as ActionType
                    )
                )
            }
        })
            .filter(line => !!line)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private migrateAlterColumnSQL(
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
            case "DROP": return schema.migrateAlterSQL(action)

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

    private migrateAlterForeignKeyConstraintSQL(
        column: string,
        action: ActionType
    ): string {
        const col = this.findOrThrow(column)
        if (!col.map.references) PolyORMException.MySQL.throwOutOfOperation(
            'CANNOT_DROP_FIELD_OR_KEY', col.foreignKeyName, col.name
        )

        return col.map.references!.migrateAlterSQL(action)
    }
}

export {
    ColumnSQLBuilder,
    ForeignKeyConstraintSQLBuilder,

    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap
}