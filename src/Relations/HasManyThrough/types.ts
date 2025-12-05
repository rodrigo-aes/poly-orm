import type { Entity } from "../../types"
import type { HasManyThroughHandler } from "./index"
import type { Collection } from "../../Entities"

export type HasManyThrough<
    T extends Entity,
    C extends Collection<T> = Collection<T>
> = (
        HasManyThroughHandler<Entity, T, C> & T
    )
