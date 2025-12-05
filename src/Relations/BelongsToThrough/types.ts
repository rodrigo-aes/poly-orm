import type { Entity } from "../../types"
import type { BelongsToThroughHandler } from "./index"

export type BelongsToThrough<T extends Entity> = (
    BelongsToThroughHandler<Entity, T> & T
)