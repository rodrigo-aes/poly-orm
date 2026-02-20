import type { RelationOptions, TargetGetter } from "../types"
import type { Constructor } from "../../../../../types"
import type { Collection } from "../../../../../Entities"
import type { BaseRelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
export interface HasManyOptions extends RelationOptions {
    FK: string
    related: TargetGetter
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}

export interface HasManyMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    foreignKey: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}