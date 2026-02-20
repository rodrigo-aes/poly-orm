import type {
    RelationOptions,
    TargetGetter,
    EntityTargetGetter
} from "../types"
import type { EntityMetadataJSON } from "../../../types"
import type {
    ColumnMetadata,
    ColumnMetadataJSON
} from "../../../ColumnsMetadata"
import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../PolymorphicEntityMetadata"
import type { BaseRelationMetadataJSON } from "../types"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'

export interface BelongsToThroughOptions extends RelationOptions {
    related: TargetGetter,
    through: EntityTargetGetter
    FK: string
    throughFK: string
    scope?: ConditionalQueryOptions<any>
}

export type ThroughForeignKeysMap = {
    [key: string]: ColumnMetadata
}

export interface BelongsToThroughMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON | PolymorphicEntityMetadataJSON
    through: EntityMetadataJSON
    FK: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    throughFK: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}