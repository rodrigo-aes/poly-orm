import type { Entity, EntityPropertiesKeys } from "../../types"

export type EntityGroupQueryOptions<T extends Entity> = (
    EntityPropertiesKeys<T>
)[]

export type RelationsGroupQueryOptions = string[]

export type GroupQueryOptions<T extends Entity> = (
    EntityGroupQueryOptions<T> &
    RelationsGroupQueryOptions
)