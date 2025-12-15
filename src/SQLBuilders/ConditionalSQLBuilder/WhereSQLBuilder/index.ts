import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Types
import type { Entity, Constructor } from "../../../types"

export default class WhereSQLBuilder<
    T extends Entity
> extends ConditionalSQLBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WHERE ${this.conditionalSQL()}`
    }
}