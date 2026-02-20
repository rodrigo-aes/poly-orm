import type { RelationOptions, BaseRelationMetadataJSON } from "../types"
import type { Constructor } from "../../../../../types"
import type { Collection } from "../../../../../Entities"
import type { ForeignKeyActionListener } from "../../../ColumnsMetadata"
import type { EntityMetadataJSON } from "../../../types"
import type { JoinTableMetadataJSON } from "../../../JoinTablesMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { EntityTargetGetter } from "../types"

export interface BelongsToManyOptions extends RelationOptions {
    related: EntityTargetGetter
    joinTable?: string
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}

export interface BelongsToManyMetadataJSON extends BaseRelationMetadataJSON {
    related: EntityMetadataJSON
    joinTable: JoinTableMetadataJSON
    onDelete?: ForeignKeyActionListener
    onUpdate?: ForeignKeyActionListener
    scope?: ConditionalQueryOptions<any>
    collection?: Constructor<Collection<any>>
}