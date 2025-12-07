import type {
    Entity,
    Target,
    EntityProperties,
    EntityRelations
} from "../../types"
import type { Collection, Pagination } from "../../Entities"

export type MySQL2RawData = any
export type DataFillMethod = 'One' | 'Many' | 'Paginate'

export type JSONData<T extends Target> = (
    EntityProperties<InstanceType<T>> &
    Partial<EntityRelations<InstanceType<T>>>
)

export type EntityData<T extends Entity> = (
    (T | null) |
    Collection<T> |
    Pagination<T>
)

export type MappedDataType<
    T extends Target,
    M extends 'json' | 'entity'
> = M extends 'json'
    ? JSONData<T>
    : M extends 'entity'
    ? InstanceType<T>
    : never