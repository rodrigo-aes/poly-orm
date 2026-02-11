import type { Entity } from "../../types"
import type { CreationAttributes } from "../CreateSQLBuilder"

export type UpdateAttributes<T extends Entity = Entity> = (
    Partial<CreationAttributes<T>>
)

export type UpdateAttributesKeys<T extends Entity = Entity> = (
    (keyof UpdateAttributes<T>)[]
)