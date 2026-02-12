import type { Entity } from "../../types"
import type { BelongsToThroughHandler } from "./index"

export type BelongsToThrough<T extends Partial<Entity>> = (
    BelongsToThroughHandler<Entity, T & Entity> & T
)