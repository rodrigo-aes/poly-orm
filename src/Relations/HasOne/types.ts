import type { Entity } from "../../types"
import type { HasOneHandler } from "./index"

export type HasOne<T extends Entity> = (
    HasOneHandler<Entity, T> & T
)