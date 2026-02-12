import type { Entity } from "../../types"
import type { PolymorphicHasOneHandler } from "./index"

export type PolymorphicHasOne<T extends Partial<Entity>> = (
    PolymorphicHasOneHandler<Entity, T & Entity> & T
)