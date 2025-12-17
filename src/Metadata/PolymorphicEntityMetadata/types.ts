import type { PolymorphicEntityTarget, EntityTarget } from "../../types"
import type EntityMetadata from "../EntityMetadata"
import type {
    RelationsMetadataJSON,
    HooksMetadataJSON,
    ScopesMetadataJSON,
    ComputedPropertiesJSON,
    CollectionsMetadataJSON,
    PaginationsMetadataJSON
} from "../EntityMetadata"

import type {
    PolymorphicColumnsMetadataJSON
} from "./PolymorphicColumnsMetadata"

import type { PolymorphicRepository } from "../../Repositories"

export type UnionEntitiesMap = {
    [K: string]: EntityTarget
}

export type SourcesMetadata = {
    [K: string]: EntityMetadata
}

export type PolymorphicEntityMetadataJSON = {
    target: PolymorphicEntityTarget
    name: string
    tableName: string
    columns: PolymorphicColumnsMetadataJSON
    relations?: RelationsMetadataJSON
    repository: typeof PolymorphicRepository
    hooks?: HooksMetadataJSON
    scopes?: ScopesMetadataJSON
    computedProperties?: ComputedPropertiesJSON
    collections?: CollectionsMetadataJSON
    paginations?: PaginationsMetadataJSON
}
