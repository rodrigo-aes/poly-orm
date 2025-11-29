import type { Entity, EntityProperties } from "../../types"

export type UpdateAttributes<T extends Entity> = (
    Partial<EntityProperties<T>>
)

export type UpdateAttributesKeys<T extends Entity> = (
    (keyof UpdateAttributes<T>)[]
)