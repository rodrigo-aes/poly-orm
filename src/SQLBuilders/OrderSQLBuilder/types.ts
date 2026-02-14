import type { Entity, EntityPropsKeys, EntityRelationsKeys } from "../../types"
import type { Case, CaseQueryOptions } from "../ConditionalSQLBuilder"

export type OrderDirection = 'ASC' | 'DESC'

export type OrderQueryOption<T extends Entity> = [
    EntityPropsKeys<T> | string,
    OrderDirection
]

export type OrderCaseOption<T extends Entity> = {
    [Case]: CaseQueryOptions<T>
}

export type OrderQueryOptions<T extends Entity> = (
    OrderQueryOption<T> | OrderCaseOption<T>
)[]