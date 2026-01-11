import type { ActionType } from "../types"
import type ColumnSchema from "./ColumnSchema"
import type {
    ColumnSchemaInitMap,
    ForeignKeyRefSchema
} from "./ColumnSchema"

export type TableSchemaInitMap = {
    tableName: string
    columns: (ColumnSchema | ColumnSchemaInitMap)[]
}

export type TableSchemaAction = [
    ActionType | 'ADD-PK' | 'ADD-UNIQUE' | 'DROP-PK' | 'DROP-UNIQUE',
    ColumnSchema | ForeignKeyRefSchema
]