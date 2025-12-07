import type { Entity, EntityRelationsKeys } from "../../types"
import type { SelectOptions } from "../SelectSQLBuilder"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type SelectSQLBuilder from "../SelectSQLBuilder"
import type OnSQLBuilder from "../ConditionalSQLBuilder/OnSQLBuilder"

export type RelationOptions<T extends Entity> = {
    required?: boolean
    select?: SelectOptions<T>,
    on?: ConditionalQueryOptions<T>,
    relations?: RelationsOptions<T>
}

export type RelationsOptions<T extends Entity> = Partial<{
    [K in EntityRelationsKeys<T>]: (
        boolean |
        RelationOptions<Extract<T[K], Entity>>
    )
}>


export type EntityRelationMap = {
    select: SelectSQLBuilder<any>,
    on: OnSQLBuilder<any, any>,
    relations?: EntityRelationMap
}

export type EntityRelationsMap<T extends Entity> = {
    [K in EntityRelationsKeys<T>]: EntityRelationMap
}