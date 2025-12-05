import type { Entity } from "../../types"
import type { BelongsToHandler } from "./index"

export type BelongsTo<T extends Entity> = (
    BelongsToHandler<Entity, T> & T
)
