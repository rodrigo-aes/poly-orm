import type { Entity, EntityPropsKeys } from "../../types"

export type EntityGroupQueryOptions<T extends Entity> = (
    EntityPropsKeys<T>
)[]

export type RelationsGroupQueryOptions = string[]

export type GroupQueryOptions<T extends Entity> = (
    EntityGroupQueryOptions<T> &
    RelationsGroupQueryOptions
)