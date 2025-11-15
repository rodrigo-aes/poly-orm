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
    InternalPolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,

    AsEntityTarget,
    AsPolymorphicEntityTarget
} from './Entities'

import type { CollectionTarget } from './Collections'

export type Constructor<T extends object> = new (...args: any[]) => T
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
    InternalPolymorphicEntityTarget,
    LocalOrInternalPolymorphicEntityTarget,

    AsEntityTarget,
    AsPolymorphicEntityTarget,

    CollectionTarget
}