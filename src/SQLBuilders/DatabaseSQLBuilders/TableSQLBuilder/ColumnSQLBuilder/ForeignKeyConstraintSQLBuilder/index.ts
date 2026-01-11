import ForeignKeyRefSchema from "../../../../../DatabaseSchema/TableSchema/ColumnSchema/ForeignKeyRefSchema"

// Types
import type { ActionType } from "../../../../../DatabaseSchema"

export default class ForeignKeyConstraintSQLBuilder extends
    ForeignKeyRefSchema {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public createSQL(): string {
        return this.constraintSQL()
    }

    // ------------------------------------------------------------------------

    public addSQL(): string {
        return 'ADD ' + this.constraintSQL()
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return `DROP FOREIGN KEY ${this.name}`
    }

    // ------------------------------------------------------------------------

    public alterSQL(): string {
        return `${this.dropSQL()}, ${this.addSQL()}`
    }

    // ------------------------------------------------------------------------

    public migrateAlterSQL(action: ActionType): string {
        switch (action) {
            case "CREATE": return this.addSQL()
            case "ALTER": return this.alterSQL()
            case "DROP": return this.dropSQL()

            default: return ''
        }
    }

    // Privates ---------------------------------------------------------------
    private constraintSQL(): string {
        return `CONSTRAINT ${this.name} FOREIGN KEY (${(
            this.columnName
        )}) REFERENCES ${this.map.tableName}(${this.map.columnName})${(
            this.map.onDelete
                ? ` ON DELETE ${this.map.onDelete}`
                : ''
        )} ${(
            this.map.onUpdate
                ? ` ON UPDATE ${this.map.onUpdate}`
                : ''
        )}`
    }
}