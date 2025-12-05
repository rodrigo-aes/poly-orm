import type { Entity } from "../../types"
import type { HasManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type HasMany<
    T extends Entity,
    C extends Collection<T> = Collection<T>
> = (
        HasManyHandler<Entity, T, C> & T
    )