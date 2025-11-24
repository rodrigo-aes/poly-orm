import type BaseEntity from "../BaseEntity"
import type BasePolymorphicEntity from "."
import type { EntityTarget, Constructor } from "../../types"

export type SourceEntities<T extends BasePolymorphicEntity<any>> =
    T extends BasePolymorphicEntity<infer U>
    ? U
    : never

export type SourceEntity<T extends BaseEntity[]> =
    Constructor<T[number]> extends infer U
    ? U extends EntityTarget
    ? InstanceType<U>
    : never
    : never

export type EntityNames<T extends BaseEntity[]> = T[number]['name']

export type EntitiesMap<T extends BaseEntity[]> = {
    [K in EntityNames<T>]: Constructor<Extract<T[number], { name: K }>>
}

export type Source<T extends BasePolymorphicEntity<any>> = (
    SourceEntity<SourceEntities<T>> |
    Constructor<SourceEntity<SourceEntities<T>>> |
    EntityNames<SourceEntities<T>>
)

export type ResolveSource<
    T extends BasePolymorphicEntity<any>,
    S extends Source<T>
> = (
        S extends EntityNames<SourceEntities<T>>
        ? InstanceType<EntitiesMap<SourceEntities<T>>[S]>
        : S extends SourceEntity<SourceEntities<T>>
        ? S
        : S extends Constructor<SourceEntity<SourceEntities<T>>>
        ? InstanceType<S>
        : never
    )


import { Foo, Bar } from "../../TestTools/Entities"

type T = ResolveSource<BasePolymorphicEntity<[Foo, Bar]>, 'Foo'>;
