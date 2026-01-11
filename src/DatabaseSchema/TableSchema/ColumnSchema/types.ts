import type { DataType } from "../../../Metadata"
import type { ActionType } from "../../types"
import type ForeignKeyRefSchema from "./ForeignKeyRefSchema"
import type { ForeignKeyRefSchemaMap } from "./ForeignKeyRefSchema"
import type CheckConstraintSchema from "./CheckConstraintSchema"
import type { ColumnPattern } from "../../../Metadata"

export interface ColumnSchemaMap {
    columnType?: string
    nullable?: boolean
    primary?: boolean
    autoIncrement?: boolean
    defaultValue?: any
    unsigned?: boolean
    unique?: boolean
    isForeignKey?: boolean
    references?: ForeignKeyRefSchema

    pattern?: ColumnPattern
    check?: CheckConstraintSchema
}

export type ColumnSchemaInitMap = (
    {
        tableName: string
        name: string
        dataType: string | DataType
    } &
    Omit<ColumnSchemaMap, 'references'>
    & {
        references?: (
            ForeignKeyRefSchema |
            ForeignKeyRefSchemaMap
        )
    }
)

export type ColumnSchemaChild = (
    ForeignKeyRefSchema |
    CheckConstraintSchema
)

export type ColumnSchemaAction = [
    ActionType,
    ColumnSchemaChild
]
