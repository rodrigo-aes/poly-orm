import type { Entity } from "../../types"
import type { HasManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type HasMany<
    T extends Partial<Entity>,
    C extends Collection<any> = Collection<T & Entity>
> = (
        HasManyHandler<Entity, T & Entity, C> & C
    )