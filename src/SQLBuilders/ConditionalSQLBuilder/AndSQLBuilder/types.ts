import type { Entity, EntityPropertiesKeys } from "../../../types"
import type { CompatibleOperators } from "../Operator"
import type { ExistsQueryOptions } from "../ExistsSQLBuilder"

export type PropAndQueryOptions<T extends Entity> = Partial<{
    [K in EntityPropertiesKeys<T>]: (
        T[K] |
        Partial<CompatibleOperators<T[K]>>
    )
}>

export type RelationAndQueryOptions = {
    [k: string]: any | Partial<CompatibleOperators<any>>
}

export type AndQueryOptions<T extends Entity> = (
    PropAndQueryOptions<T> &
    RelationAndQueryOptions &
    Partial<ExistsQueryOptions<T>>
)