import type { Entity, OptionalNullable, EntityProperties } from "../../types"

export type CreationAttributes<T extends Entity> = OptionalNullable<
    EntityProperties<T>
>

export type CreationAttributesOptions<T extends Entity> = (
    CreationAttributes<T> |
    CreationAttributes<T>[]
)

export type CreationAttributesKey<T extends Entity> = (
    keyof CreationAttributes<T>
)

export type AttributesNames<T extends Entity> = Set<
    CreationAttributesKey<T>
>
