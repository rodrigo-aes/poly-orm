import type { Entity } from "../../types"
import type { AndQueryOptions } from "./AndSQLBuilder"
import type { OrQueryOptions } from "./OrSQLBuilder"

export type ConditionalQueryOptions<T extends Entity> = (
    AndQueryOptions<T> |
    OrQueryOptions<T>
)

export type {
    AndQueryOptions,
    OrQueryOptions
}