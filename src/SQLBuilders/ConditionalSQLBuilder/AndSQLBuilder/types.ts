import type { Entity, EntityPropertiesKeys } from "../../../types"
import type { CompatibleOperators } from "../Operator"
import type { ExistsQueryOptions } from "../ExistsSQLBuilder"

type StringConditionalValue = string | RegExp
type ConditionalValue<T extends any> = (
    T extends string
    ? StringConditionalValue
    : T
)

export type PropAndQueryOptions<T extends Entity> = Partial<{
    [K in EntityPropertiesKeys<T>]: (
        ConditionalValue<T[K]> |
        Partial<CompatibleOperators<T[K]>>
    )
}>

export type RelationAndQueryOptions = {
    [k: string]: ConditionalValue<any> | Partial<CompatibleOperators<any>>
}

export type AndQueryOptions<T extends Entity> = (
    PropAndQueryOptions<T> &
    RelationAndQueryOptions &
    Partial<ExistsQueryOptions<T>>
)