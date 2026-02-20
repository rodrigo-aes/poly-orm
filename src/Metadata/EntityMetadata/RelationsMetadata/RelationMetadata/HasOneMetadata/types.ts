import type { RelationOptions, TargetGetter } from "../types"
import type { BaseRelationMetadataJSON } from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type { ColumnMetadataJSON } from "../../../ColumnsMetadata"
import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export interface HasOneOptions extends RelationOptions {
    FK: string
    related: TargetGetter
    scope?: ConditionalQueryOptions<any>
}

export interface HasOneMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    foreignKey: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}