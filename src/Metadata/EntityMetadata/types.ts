import type { EntityTarget } from "../../types"
import type { ColumnsMetadataJSON } from "./ColumnsMetadata"
import type { RelationsMetadataJSON } from "./RelationsMetadata"
import type { JoinTableMetadataJSON } from "./JoinTablesMetadata/JoinTableMetadata"
import type { HooksMetadataJSON } from "./HooksMetadata"
import type { ComputedPropertiesJSON } from "./ComputedPropertiesMetadata"
import type { CollectionsMetadataJSON } from "./CollectionsMetadata"
import type { PaginationsMetadataJSON } from "./PaginationsMetadata"
import type { ScopesMetadataJSON } from "./ScopesMetadata"
import type Repository from "../../Repositories/Repository"
import type { Trigger } from "../../Triggers"

export type EntityMetadataJSON = {
    target: EntityTarget
    name: string
    tableName: string
    columns: ColumnsMetadataJSON
    relations?: RelationsMetadataJSON
    joinTables?: JoinTableMetadataJSON[]
    Repository: typeof Repository
    hooks?: HooksMetadataJSON
    scopes?: ScopesMetadataJSON
    computedProperties?: ComputedPropertiesJSON
    triggers?: (typeof Trigger)[]
    collections?: CollectionsMetadataJSON
    paginations?: PaginationsMetadataJSON
}