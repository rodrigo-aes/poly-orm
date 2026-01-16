// Schemas
import TableSchema from "../../../DatabaseSchema/TableSchema"
import ColumnSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema"
import ForeignKeyRefSchema from "../../../DatabaseSchema/TableSchema/ColumnSchema/ForeignKeyRefSchema"

// SQL Builders
import ColumnSQLBuilder, {
    ForeignKeyConstraintSQLBuilder,
    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap,
    type ColumnSQLBuilderChild
} from "./ColumnSQLBuilder"

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
        return `CREATE TABLE ${this.name} (${this.createColsSQL()})`
    }

    // ------------------------------------------------------------------------

    public createIfNotExistsSQL(): string {
        return `CREATE TABLE IF NOT EXISTS ${this.name} (${(
            this.createColsSQL()
        )})`
    }

    // ------------------------------------------------------------------------

    public dropSQL() {
        return `DROP TABLE ${this.name}`
    }

    // Privates ---------------------------------------------------------------
    private createColsSQL(): string {
        return this.map(column => column.createSQL()).join(', ')
    }
}

export {
    ColumnSQLBuilder,
    ForeignKeyConstraintSQLBuilder,

    PolymorphicId,
    CurrentTimestamp,

    type ColumnSQLBuilderMap,
    type ColumnSQLBuilderChild
}