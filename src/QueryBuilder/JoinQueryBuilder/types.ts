import type { Entity, EntityRelationsKeys } from "../../types"

import type JoinQueryBuilder from "."
import type SelectQueryBuilder from "../SelectQueryBuilder"
import type ConditionalQueryBuilder from "../ConditionalQueryBuilder"

export type JoinQueryOptions<T extends Entity> = Partial<{
    [K in EntityRelationsKeys<T>]: boolean | JoinQueryBuilder<any>
}>

export type JoinQueryClause<T extends Entity> = {
    required?: boolean
    select?: SelectQueryBuilder<T>,
    on?: ConditionalQueryBuilder<T>,
    relations?: JoinQueryOptions<T>
}
