import type {
    RelationOptions,
    TargetGetter,
    EntityTargetGetter
} from "../types"
import type { BaseRelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export interface HasOneThroughOptions extends RelationOptions {
    FK: string
    throughFK: string
    related: TargetGetter
    through: EntityTargetGetter
    scope?: ConditionalQueryOptions<any>
}

export interface HasOneThroughMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    through: EntityMetadataJSON
    FK: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    throughFK: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}