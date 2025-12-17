import type {
    Entity,
    Target,
    StaticTarget,
    EntityObject,
    EntityJSON,

    EntityTarget,
    StaticEntityTarget,

    PolymorphicEntityTarget,
    StaticPolymorphicEntityTarget,

    TargetMetadata,
    TargetRepository,
    TargetQueryBuilder,
    InternalPolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,

    AsEntityTarget,
    AsPolymorphicEntityTarget
} from './Entities'

import type { CollectionTarget } from './Collections'
import type { PaginationTarget } from './Paginations'

export type Constructor<T extends object> = new (...args: any[]) => T
export type ConstructorsOf<T extends object[]> = {
    [K in keyof T]: Constructor<T>
}
export type InstancesOf<T extends Constructor<any>[]> = {
    [K in keyof T]: InstanceType<T[K]>
}

export type Primitive = string | number | boolean | Date | null

export type {
    Entity,
    Target,
    StaticTarget,
    EntityObject,
    EntityJSON,

    EntityTarget,
    StaticEntityTarget,

    PolymorphicEntityTarget,
    StaticPolymorphicEntityTarget,

    TargetMetadata,
    TargetRepository,
    TargetQueryBuilder,
    InternalPolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,

    AsEntityTarget,
    AsPolymorphicEntityTarget,

    CollectionTarget,
    PaginationTarget
}
