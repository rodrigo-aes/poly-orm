import type { Entity } from "../../types"
import type { CreateAttributes } from "../CreateSQLBuilder"

export type UpdateAttributes<T extends Entity = Entity> = (
    Partial<CreateAttributes<T>>
)

export type UpdateAttributesKeys<T extends Entity = Entity> = (
    (keyof UpdateAttributes<T>)[]
)