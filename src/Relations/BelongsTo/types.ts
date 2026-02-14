import type { Entity } from "../../types"
import type { BelongsToHandler } from "./index"

export type BelongsTo<R extends Partial<Entity>> = (
    BelongsToHandler<Entity, R & Entity> & R
)