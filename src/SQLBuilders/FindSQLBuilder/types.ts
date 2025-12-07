import type { Entity } from "../../types"
import type { FindOneQueryOptions } from "../FindOneSQLBuilder"
import type { OrderQueryOptions } from "../OrderSQLBuilder/types"

export interface FindQueryOptions<
    T extends Entity
> extends FindOneQueryOptions<T> {
    order?: OrderQueryOptions<T>
    limit?: number
    offset?: number
}