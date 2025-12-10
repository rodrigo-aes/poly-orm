import type { Entity } from "../../types"

import type { SelectOptions } from "../SelectSQLBuilder"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { RelationsOptions } from "../JoinSQLBuilder/types"
import type { GroupQueryOptions } from "../GroupSQLBuilder/types"

export type FindOneQueryOptions<T extends Entity> = {
    select?: SelectOptions<T>
    where?: ConditionalQueryOptions<T>
    relations?: RelationsOptions<T>
    group?: GroupQueryOptions<T>
}