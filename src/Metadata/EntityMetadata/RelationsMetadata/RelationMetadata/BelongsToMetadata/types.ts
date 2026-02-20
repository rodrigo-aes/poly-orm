import type {
    RelationOptions,
    BaseRelationMetadataJSON,
    TargetGetter
} from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export interface BelongsToOptions extends RelationOptions {
    related: TargetGetter
    FK: string
    scope?: ConditionalQueryOptions<any>
}

export interface BelongsToMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    FK: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}