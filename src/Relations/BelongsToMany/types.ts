import type { Entity } from "../../types"
import type { BelongsToManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type BelongsToMany<
    T extends Entity,
    C extends Collection<T> = Collection<T>
> = (
        BelongsToManyHandler<Entity, T, C> & T
    )