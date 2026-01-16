import type { ActionType } from "../types"
import type ColumnSchema from "./ColumnSchema"
import type {
    ColumnSchemaInitMap
} from "./ColumnSchema"

export type TableSchemaInitMap = {
    tableName: string
    columns: (ColumnSchema | ColumnSchemaInitMap)[]
}

export type TableSchemaActionType =
    ActionType | 'ADD-PK' | 'ADD-UNIQUE' | 'DROP-PK' | 'DROP-UNIQUE'

export type TableSchemaAction = [TableSchemaActionType, ColumnSchema]