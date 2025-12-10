import type { Entity, EntityProperties } from "../../types"

export type UpdateAttributes<T extends Entity = Entity> = (
    Partial<EntityProperties<T>>
)

export type UpdateAttributesKeys<T extends Entity = Entity> = (
    (keyof UpdateAttributes<T>)[]
)