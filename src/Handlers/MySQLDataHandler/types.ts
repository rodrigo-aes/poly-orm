import type {
    Entity,
    Constructor,
    EntityProperties,
    EntityRelations,
    TargetMetadata
} from "../../types"
import type { RelationMetadataType } from "../../Metadata"
import type { MapOptions, CollectMapOptions } from "../MySQLOperation"
import type { Collection, Pagination, PaginationInitMap } from "../../Entities"

export type FillMethod = 'One' | 'Many' | 'Paginate'

export type JSONData<T extends Entity> = (
    EntityProperties<T> &
    Partial<EntityRelations<T>>
)

export type EntityData<T extends Entity> = (
    (T | null) |
    Collection<T> |
    Pagination<T>
)

export type ParseOptions<T extends Entity> = {
    target: Constructor<T>,
    fillMethod: FillMethod,
    raw: any[],
    mapOptions?: MapOptions | CollectMapOptions<T>,
    toSource?: boolean,
    pagination?: PaginationInitMap
}

export type ReduceOptions<T extends Entity> = {
    raw: any[],
    target?: Constructor<T>,
    metadata?: TargetMetadata<T>,
    relation?: RelationMetadataType,
    method?: 'json' | 'entity',
    toSource?: boolean,
}

export type FilterRelationsOptions = {
    line: any[],
    metadata: TargetMetadata<any>,
    method?: 'json' | 'entity',
    parent?: Entity
}