import type { Entity, EntityPropertiesKeys } from "../../../types"
import type { CompatibleOperators } from "../Operator"
import type { ConditionalQueryOptions } from "../types"

export type EntityWhenQueryOptions<T extends Entity> = Partial<{
    [K in EntityPropertiesKeys<T>]: (
        T[K] |
        Partial<CompatibleOperators<T[K]>>
    )
}>

export type RelationWhenQueryOptions = {
    [K: string]: any | Partial<CompatibleOperators<any>>
}

export type WhenQueryOption<T extends Entity> = (
    ConditionalQueryOptions<T>
)

export type ThenQueryOption = any
export type ElseQueryOption = any | undefined

export type CaseQueryTuple<T extends Entity> = [
    WhenQueryOption<T>,
    ThenQueryOption
]

export type CaseQueryOptions<T extends Entity> = [
    ...CaseQueryTuple<T>[],
    ElseQueryOption
]