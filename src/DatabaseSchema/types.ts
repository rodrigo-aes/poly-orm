import type TableSchema from "./TableSchema"

export type ActionType = 'CREATE' | 'ALTER' | 'DROP' | 'REBUILD' | 'NONE'
export type DatabaseSchemaAction = [ActionType, TableSchema]

export type TableSchemaHandler = (table: TableSchema) => void