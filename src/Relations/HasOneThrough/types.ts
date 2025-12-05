import type { Entity } from "../../types"
import type { HasOneThroughHandler } from "./index"

export type HasOneThrough<T extends Entity> = (
    HasOneThroughHandler<Entity, T> & T
)