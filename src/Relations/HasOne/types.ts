import type { Entity } from "../../types"
import type { HasOneHandler } from "./index"

export type HasOne<T extends Partial<Entity>> = (
    HasOneHandler<Entity, T & Entity> & T
)