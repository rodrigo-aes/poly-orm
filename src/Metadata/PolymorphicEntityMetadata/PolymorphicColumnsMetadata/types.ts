import type { EntityTarget } from "../../../types"
import type { PolymorphicColumnMetadataJSON } from './PolymorphicColumnMetadata'

export type IncludeColumnOptions = {
    target: EntityTarget,
    column: string
}[]

export type IncludedColumns = {
    [Key: string]: IncludeColumnOptions | undefined
}

export type PolymorphicColumnsMetadataJSON = PolymorphicColumnMetadataJSON[]