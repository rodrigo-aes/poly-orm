import type { ColumnSchemaMap } from "../../../../DatabaseSchema"
import type ForeignKeyConstraintSQLBuilder
    from "./ForeignKeyConstraintSQLBuilder"
import type CheckConstraintSQLBuilder
    from "./CheckConstraintSQLBuilder"

export interface ColumnSQLBuilderMap extends ColumnSchemaMap {
    references?: ForeignKeyConstraintSQLBuilder,
    check?: CheckConstraintSQLBuilder
}

export type ColumnSQLBuilderChild = (
    ForeignKeyConstraintSQLBuilder |
    CheckConstraintSQLBuilder
)