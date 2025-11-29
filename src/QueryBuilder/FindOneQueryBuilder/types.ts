import type { Entity } from "../../types"

import type SelectQueryBuilder from "../SelectQueryBuilder"
import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"
import type GroupQueryBuilder from "../GroupQueryBuilder"
import type { JoinQueryOptions } from "../JoinQueryBuilder"

export type FindOneQueryOptions<
    T extends Entity
> = {
    select?: SelectQueryBuilder<T>
    where?: ConditionalQueryBuilder<T>
    relations?: JoinQueryOptions<T>
    group?: GroupQueryBuilder<T>

}