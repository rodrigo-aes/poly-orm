import type { Entity } from "../../../../types"
import type { Collection } from "../../../../Entities"
import type {
    PaginateMapOptions,
    ResolvePagination,
    ResolveCollection
} from "../types"

export type PaginateResult<
    T extends Entity,
    P extends PaginateMapOptions<T> = PaginateMapOptions<T>
> = Omit<ResolvePagination<T, P['pagination']>, 'data'> & {
    data: ResolveCollection<T, P['collection']> & Collection<T>
}

