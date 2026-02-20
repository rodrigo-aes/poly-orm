import type {
    RelationOptions,
    TargetGetter,
    EntityTargetGetter
} from "../types"
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


export interface HasManyThroughOptions extends RelationOptions {
    FK: string
    throughFK: string
    related: TargetGetter
    through: EntityTargetGetter
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}

export interface HasManyThroughMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    through: EntityMetadataJSON
    FK: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    throughFK: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}