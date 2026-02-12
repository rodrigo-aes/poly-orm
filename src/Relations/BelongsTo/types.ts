import type { Entity } from "../../types"
import type { BelongsToHandler } from "./index"

export type BelongsTo<T extends Partial<Entity>> = (
    BelongsToHandler<Entity, T & Entity> & T
)