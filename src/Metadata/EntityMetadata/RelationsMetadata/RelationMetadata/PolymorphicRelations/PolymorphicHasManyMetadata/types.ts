import type { Constructor } from "../../../../../../types"
import type { Collection } from "../../../../../../Entities"
import type { BaseRelationMetadataJSON } from "../../types"
import type { EntityMetadataJSON } from "../../../../types"
import type { ColumnMetadataJSON } from "../../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'

export interface PolymorphicHasManyMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON
    FK: ColumnMetadataJSON
    TK?: ColumnMetadataJSON
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}