import type { ConditionalQueryOptions } from "../../ConditionalSQLBuilder"
import type { Entity } from "../../../types"
import type { RelationOptions } from "../../JoinSQLBuilder"

export interface FindRelationQueryOptions<T extends Entity> {
    where?: ConditionalQueryOptions<T>
    relations?: RelationOptions<T>
}
