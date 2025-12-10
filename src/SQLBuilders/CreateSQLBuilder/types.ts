import type { Entity, OptionalNullable, EntityProperties } from "../../types"

export type CreationAttributes<T extends Entity = Entity> = OptionalNullable<
    EntityProperties<T>
>

export type CreationAttributesOptions<T extends Entity = Entity> = (
    CreationAttributes<T> |
    CreationAttributes<T>[]
)

export type CreationAttributesKey<T extends Entity = Entity> = (
    keyof CreationAttributes<T>
)

export type AttributesNames<T extends Entity = Entity> = Set<
    CreationAttributesKey<T>
>
