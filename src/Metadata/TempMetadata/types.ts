import type { TargetMetadata } from "../../types"
import type { PolyORMConnection } from "../ConnectionsMetadata"
import type { ScopeMetadata } from "../EntityMetadata"

export type TempMetadataValue = {
    connection?: PolyORMConnection
    metadata?: TargetMetadata<any>
    scope?: ScopeMetadata
}