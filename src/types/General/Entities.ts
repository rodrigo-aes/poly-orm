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
import type { EntityProps, EntityRelations } from "../Properties"

// Bases =============================================================================================================
export type Entity = BaseEntity | BasePolymorphicEntity<any>
export type Target<T extends Entity = Entity> = Constructor<T>

export type StaticTarget<T extends Target | Entity = Target> = (
    T extends Target
    ? T
    : T extends Entity
    ? Target<T>
    : never
) & typeof EntityClass

export type EntityObject<T extends Entity> = (
    EntityProps<T> &
    EntityRelations<T> & {
        [K in Extract<T['include'], keyof T>]: T[K]
    }
)

export type EntityJSON<T extends Entity> = Omit<
    EntityObject<T>, Extract<T['hidden'], keyof T>
>

// Entity Target ==============================================================
export type EntityTarget<T extends BaseEntity = BaseEntity> = Constructor<T>
export type AsEntityTarget<T> = Extract<T, EntityTarget>
export type StaticEntityTarget<
    T extends EntityTarget | BaseEntity = EntityTarget
> = (
    T extends EntityTarget
    ? T
    : T extends BaseEntity
    ? EntityTarget<T>
    : never
) & typeof BaseEntity

// Polymorphic Entity Target ==================================================
export type PolymorphicEntityTarget<T
    extends BasePolymorphicEntity<any> = BasePolymorphicEntity<any>
> = Constructor<T>
export type AsPolymorphicEntityTarget<T> = Extract<T, PolymorphicEntityTarget>
export type StaticPolymorphicEntityTarget<
    T extends PolymorphicEntityTarget | BasePolymorphicEntity<any> = (
        PolymorphicEntityTarget
    )
> = (
    T extends PolymorphicEntityTarget
    ? T
    : T extends BasePolymorphicEntity<any>
    ? PolymorphicEntityTarget<T>
    : never
) & typeof BasePolymorphicEntity<any>


// Targets Components =========================================================
export type TargetMetadata<T extends Entity> = (
    T extends BaseEntity
    ? EntityMetadata
    : T extends BasePolymorphicEntity<any>
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

export type InternalPolymorphicEntityTarget<T extends BaseEntity[]> = (
    Constructor<BasePolymorphicEntity<T>>
)

export type LocalOrInternalPolymorphicEntityTarget<
    T extends PolymorphicEntityTarget | BaseEntity[]
> = (
        T extends PolymorphicEntityTarget
        ? T
        : T extends BaseEntity[]
        ? InternalPolymorphicEntityTarget<T>
        : never
    )
