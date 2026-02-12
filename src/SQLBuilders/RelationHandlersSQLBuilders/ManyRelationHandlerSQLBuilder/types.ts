import type { RelationCreationAttributes } from "../OneRelationHandlerSQLBuilder"
import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"
import type { Entity, ExcludeRelationAttributes } from "../../../types"
import type { RelationOptions } from "../../JoinSQLBuilder"

export type RelationConditionalQueryOptions<T extends Entity> = (
    ExcludeRelationAttributes<ConditionalQueryOptions<T>>
)

export interface FindRelationQueryOptions<T extends Entity> {
    where?: RelationConditionalQueryOptions<T>
    relations?: RelationOptions<T>
}

export type RelationCreateManyAttributes<T extends Entity> = (
    RelationCreationAttributes<T>[]
)
