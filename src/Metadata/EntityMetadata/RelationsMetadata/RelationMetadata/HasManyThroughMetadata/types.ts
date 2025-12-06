import type { RelationOptions } from "../types"
import type { EntityTarget, Constructor } from "../../../../../types"
import type { Collection } from "../../../../../Entities"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type HasManyThroughRelatedGetter = () => EntityTarget
export type HasManyThroughGetter = () => EntityTarget

export interface HasManyThroughOptions extends RelationOptions {
    foreignKey: string
    throughForeignKey: string
    related: HasManyThroughRelatedGetter
    through: HasManyThroughGetter
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}

export interface HasManyThroughMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    through: EntityMetadataJSON
    relatedForeignKey: ColumnMetadataJSON
    throughForeignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}
