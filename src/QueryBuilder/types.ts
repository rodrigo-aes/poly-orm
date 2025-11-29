import type { Entity } from "../types"

import type SelectQueryBuilder from "./SelectQueryBuilder"
import type CountQueryBuilder from "./CountQueryBuilder"
import type AndQueryBuilder from "./AndQueryBuilder"
import type CaseQueryBuilder from "./CaseQueryBuilder"
import type ConditionalQueryBuilder from "./ConditionalQueryBuilder"
import type JoinQueryBuilder from "./JoinQueryBuilder"

import type PaginateQueryBuilderType from "./PaginateQueryBuilder"

export type SelectQueryHandler<T extends Entity> = (
    (qb: SelectQueryBuilder<T>) => void
)

export type CountQueryHandler<T extends Entity> = (
    (qb: CountQueryBuilder<T>) => void
)

export type AndQueryHandler<T extends Entity> = (
    (qb: AndQueryBuilder<T>) => void
)

export type CaseQueryHandler<T extends Entity> = (
    (qb: CaseQueryBuilder<T>) => void
)

export type ConditionalQueryHandler<T extends Entity> = (
    (qb: ConditionalQueryBuilder<T>) => void
)

export type JoinQueryHandler<T extends Entity> = (
    (qb: JoinQueryBuilder<T>) => void
)

export type PaginateQueryBuilder<T extends Entity> = Omit<
    PaginateQueryBuilderType<T>, (
        'limit' |
        'offset'
    )>

export type PartialQueryBuilder<T extends Entity> = (
    SelectQueryBuilder<T> |
    CountQueryBuilder<T> |
    AndQueryBuilder<T> |
    CaseQueryBuilder<T> |
    ConditionalQueryBuilder<T> |
    JoinQueryBuilder<T>
)
export type QueryHandler<
    T extends Entity,
    QB extends PartialQueryBuilder<T>
> = QB extends SelectQueryBuilder<T>
    ? SelectQueryHandler<T>
    : QB extends CountQueryBuilder<T>
    ? CountQueryHandler<T>
    : QB extends AndQueryBuilder<T>
    ? AndQueryHandler<T>
    : QB extends CaseQueryBuilder<T>
    ? CaseQueryHandler<T>
    : QB extends ConditionalQueryBuilder<T>
    ? ConditionalQueryHandler<T>
    : QB extends JoinQueryBuilder<T>
    ? JoinQueryHandler<T>
    : never