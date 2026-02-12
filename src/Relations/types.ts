import type { Entity, EntityRelationsKeys } from "../types";

import type {
    BaseEntity,
    BasePolymorphicEntity,
    Collection
} from "../Entities";

import type OneRelationHandler from "./OneRelation";
import type ManyRelationHandler from "./ManyRelation";

export type OneRelation<T extends Entity = Entity> = (
    OneRelationHandler<any, any> & T
)

export type ManyRelation<T extends Entity = Entity> = (
    ManyRelationHandler<any, any, any> & Collection<T>
)

export type RelationHandler<T extends Entity> = (
    OneRelation<T> | ManyRelation<T>
)

type NonRecursive<T extends Entity, P extends Entity> = {
    [K in EntityRelationsKeys<T> as (
        T[K] extends RelationHandler<P>
        ? never
        : K
    )]: T[K] extends RelationHandler<P>
    ? never
    : K
}

export type Related<T extends Entity, P extends Entity> = (
    Omit<T, EntityRelationsKeys<T>> & NonRecursive<T, P> & (
        T extends BaseEntity
        ? BaseEntity
        : T extends BasePolymorphicEntity<infer S>
        ? BasePolymorphicEntity<S>
        : Entity
    )
)

export type Test<T extends Partial<Entity>> = T & Entity

export type RelatedCollection<T extends Collection, P extends Entity> = (
    T extends Collection<infer R>
    ? T & Collection<Related<R, P>>
    : T
)
