import type { Entity } from "../../types"

import type { FindOneQueryOptions } from "../FindOneQueryBuilder"
import type OrderQueryBuilder from "../OrderQueryBuilder"

export interface FindQueryOptions<
    T extends Entity
> extends FindOneQueryOptions<T> {
    order?: OrderQueryBuilder<T>
    limit?: number
    offset?: number
}