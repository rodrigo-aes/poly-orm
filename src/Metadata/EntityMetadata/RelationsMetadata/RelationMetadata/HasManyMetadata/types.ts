import type { RelationOptions } from "../types"
import type { EntityTarget, Constructor } from "../../../../../types"
import type { Collection } from "../../../../../Entities"
import type { RelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export type HasManyRelatedGetter = () => EntityTarget

export interface HasManyOptions extends RelationOptions {
    foreignKey: string
    related: HasManyRelatedGetter
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}

export interface HasManyMetadataJSON extends RelationMetadataJSON {
    related: EntityMetadataJSON
    foreignKey: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}