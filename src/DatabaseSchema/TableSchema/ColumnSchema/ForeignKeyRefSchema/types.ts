import type { ForeignKeyActionListener } from "../../../../Metadata"

export type ForeignKeyRefSchemaMap = {
    tableName?: string | null
    columnName?: string | null
    constrained?: boolean
    name?: string
    onDelete?: ForeignKeyActionListener | null
    onUpdate?: ForeignKeyActionListener | null
}