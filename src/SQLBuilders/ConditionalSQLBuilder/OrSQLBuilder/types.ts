import type { Entity } from "../../../types"
import type { AndQueryOptions } from "../AndSQLBuilder"

export type OrQueryOptions<T extends Entity> = AndQueryOptions<
    T
>[]