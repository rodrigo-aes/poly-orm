import type { TargetMetadata } from "../../types"
import type { PolyORMConnection } from "../ConnectionsMetadata"
import type { ScopeMetadata } from "../EntityMetadata"
import type { Collection, Pagination } from "../../Entities"

export type TempMetadataValue = {
    connection?: PolyORMConnection
    metadata?: TargetMetadata<any>
    scope?: ScopeMetadata
    collection?: typeof Collection
    pagination?: typeof Pagination
}