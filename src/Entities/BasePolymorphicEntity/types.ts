import type BaseEntity from "../BaseEntity"
import BasePolymorphicEntity from "."
import type { EntityTarget, Constructor } from "../../types"

export type SourceEntities<T extends BasePolymorphicEntity<any>> =
    T extends BasePolymorphicEntity<infer U>
    ? U
    : never

export type SourceEntity<T extends BasePolymorphicEntity<any> | BaseEntity[]> =
    Constructor<
        T extends BasePolymorphicEntity<any>
        ? SourceEntities<T>[number]
        : T extends BaseEntity[]
        ? T[number]
        : never
    > extends infer U
    ? U extends EntityTarget
    ? InstanceType<U>
    : never
    : never

export type EntityNames<T extends BasePolymorphicEntity<any> | BaseEntity[]> = (
    T extends BasePolymorphicEntity<infer U>
    ? U[number]['__name']
    : T extends BaseEntity[]
    ? T[number]['__name']
    : never
)

export type EntitiesMap<
    T extends BasePolymorphicEntity<any> | BaseEntity[]
> = {
        [K in EntityNames<T>]: Constructor<Extract<
            T extends BasePolymorphicEntity<infer U>
            ? U[number]
            : T extends BaseEntity[]
            ? T[number]
            : never,
            { __name: K }
        >>
    }

export type Source<T extends BasePolymorphicEntity<any> | BaseEntity[]> = (
    SourceEntity<T> |
    Constructor<SourceEntity<T>> |
    EntityNames<T extends BasePolymorphicEntity<infer U> ? U : T>
)

export type ResolveSource<
    T extends BasePolymorphicEntity<any> | BaseEntity[],
    S extends Source<T>
> = S extends EntityNames<T extends BasePolymorphicEntity<infer U> ? U : T>
    ? InstanceType<EntitiesMap<(
        T extends BasePolymorphicEntity<infer U>
        ? U
        : T
    )>[S]>
    : S extends SourceEntity<T>
    ? S
    : S extends Constructor<SourceEntity<T>>
    ? InstanceType<S>
    : never