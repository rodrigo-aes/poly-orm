import type { Entity, EntityProps, RequiredProps } from "../../types"

export type CreateAttributes<T extends Entity = Entity> = (
    RequiredProps<EntityProps<T>>
)

export type CreateOneOrManyAttributes<T extends Entity = Entity> = (
    CreateAttributes<T> |
    CreateAttributes<T>[]
)

export type CreateAttributesKey<T extends Entity = Entity> = (
    keyof CreateAttributes<T>
)