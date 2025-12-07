import type { Entity } from "../../types"
import type { FindQueryOptions } from "../FindSQLBuilder"

export interface PaginationQueryOptions<
    T extends Entity
> extends Omit<FindQueryOptions<T>, 'limit' | 'offset'> {
    page?: number
    perPage?: number
}