import type { Entity } from "../../types"
import type { HasOneThroughHandler } from "./index"

export type HasOneThrough<T extends Partial<Entity>> = (
    HasOneThroughHandler<Entity, T & Entity> & T
)