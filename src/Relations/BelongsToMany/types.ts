import type { Entity } from "../../types"
import type { BelongsToManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type BelongsToMany<
    T extends Partial<Entity>,
    C extends Collection<any> = Collection<T & Entity>
> = (
        BelongsToManyHandler<Entity, T & Entity, C> & C
    )