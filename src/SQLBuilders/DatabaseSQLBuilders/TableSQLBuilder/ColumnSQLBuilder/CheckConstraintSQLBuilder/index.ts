import CheckConstraintSchema from "../../../../../DatabaseSchema/TableSchema/ColumnSchema/CheckConstraintSchema"

// Handlers
import { SQLString } from "../../../../../Handlers"

// Types
import type { ActionType } from "../../../../../DatabaseSchema"

export default class CheckConstraintSQLBuilder extends CheckConstraintSchema {
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

    public alterSQL(): string {
        return `${this.dropSQL()}, ${this.addSQL()}`
    }

    // ------------------------------------------------------------------------

    public dropSQL(): string {
        return `DROP CHECK ${this.name}`
    }

    // Private ----------------------------------------------------------------
    private constraintSQL(): string {
        return `CONSTRAINT ${this.name} CHECK (${(
            this
                .map(constraint => `${this.columnName} ${constraint}`)
                .join(' AND ')
        )})`
    }
}
