import type { EntityMetadata, PolymorphicEntityMetadata } from "../../Metadata"

import type {
    Entity as EntityClass,
    BaseEntity,
    BasePolymorphicEntity
} from "../../Entities"

import type { Repository, PolymorphicRepository } from "../../Repositories"

import type {
    EntityQueryBuilder,
    PolymorphicEntityQueryBuilder
} from "../../QueryBuilder"

import type {
    Constructor,
    InstancesOf
} from "."
import type { EntityProperties, EntityRelations } from "../.."

// Bases =============================================================================================================
export type Entity = BaseEntity | BasePolymorphicEntity<any>
export type Target = (
    Constructor<Entity> |
    EntityTarget |
    PolymorphicEntityTarget
)

export type StaticTarget<T extends Target = Target> = T & typeof EntityClass

export type EntityObject<T extends Entity> = (
    EntityProperties<T> &
    EntityRelations<T>
)

export type EntityJSON<T extends Entity, Hidden extends string[]> = Omit<
    EntityObject<T>, Hidden[number]
>

// Entity Target ==============================================================
export type EntityTarget = Constructor<BaseEntity>
export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type StaticEntityTarget<T extends EntityTarget = EntityTarget> = (
    T & typeof BaseEntity
)

// Polymorphic Entity Target ==================================================
export type PolymorphicEntityTarget = Constructor<BasePolymorphicEntity<any>>
export type AsPolymorphicEntityTarget<T> = Extract<T, PolymorphicEntityTarget>
export type StaticPolymorphicEntityTarget<T extends PolymorphicEntityTarget = (
    PolymorphicEntityTarget
)> = T & typeof BasePolymorphicEntity<any>


// Targets Components =========================================================
export type TargetMetadata<T extends Target = Target> = (
    T extends EntityTarget
    ? EntityMetadata
    : T extends PolymorphicEntityTarget
    ? PolymorphicEntityMetadata
    : never
)

export type TargetRepository<T extends Entity = Entity> = (
    T extends BaseEntity
    ? Repository<T>
    : T extends BasePolymorphicEntity<any>
    ? PolymorphicRepository<T>
    : never
)

export type TargetQueryBuilder<T extends Entity = Entity> = (
    T extends BaseEntity
    ? EntityQueryBuilder<T>
    : T extends BasePolymorphicEntity<any>
    ? PolymorphicEntityQueryBuilder<T>
    : never
)

// ----------------------------------------------------------------------------

export type InternalPolymorphicEntityTarget<T extends EntityTarget[]> = (
    Constructor<BasePolymorphicEntity<InstancesOf<T>>>
)

export type LocalOrInternalPolymorphicEntityTarget<
    T extends PolymorphicEntityTarget | EntityTarget[]
> = (
        T extends PolymorphicEntityTarget
        ? T
        : T extends EntityTarget[]
        ? InternalPolymorphicEntityTarget<T>
        : never
    )
