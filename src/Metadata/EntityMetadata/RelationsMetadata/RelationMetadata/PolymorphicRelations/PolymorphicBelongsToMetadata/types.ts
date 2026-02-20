import type {
    BaseRelationMetadataJSON,
    RelatedEntitiesMapJSON
} from "../../types"

import type {
    PolymorphicEntityMetadataJSON,
    PolymorphicColumnMetadataJSON
} from "../../../../../PolymorphicEntityMetadata"

import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'

export interface PolymorphicBelongsToMetadataJSON
    extends BaseRelationMetadataJSON {
    related: PolymorphicEntityMetadataJSON | RelatedEntitiesMapJSON
    Fk: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    TK?: ColumnMetadataJSON | PolymorphicColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
}