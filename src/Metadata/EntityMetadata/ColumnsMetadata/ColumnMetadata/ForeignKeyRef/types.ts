import type { EntityTarget } from "../../../../../types"
import type ColumnMetadata from ".."
import type { EntityMetadataJSON } from "../../../types"
import type {
    PolymorphicEntityMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { ColumnMetadataJSON } from ".."

export type ForeignKeyReferencedGetter = () => EntityTarget | EntityTarget[]

export type ForeignKeyActionListener = (
    'CASCADE' |
    'SET NULL' |
    'RESTRICT' |
    'NO ACTION'
)

export type ForeignKeyReferencesInitMap = {
    referenced: ForeignKeyReferencedGetter
    constrained?: boolean
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: any
}

export type RelatedColumnsMap = {
    [key: string]: ColumnMetadata
}

export type ForeignKeyRefJSON = {
    entity: (
        EntityMetadataJSON |
        { [k: string]: EntityMetadataJSON | PolymorphicEntityMetadataJSON }
    )
    column: ColumnMetadataJSON | { [k: string]: ColumnMetadataJSON }
    name?: string
    constrained: boolean
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: any
}