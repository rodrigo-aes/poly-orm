import type { Entity } from "../../types"
import type { HasManyThroughHandler } from "./index"
import type { Collection } from "../../Entities"

export type HasManyThrough<
    T extends Partial<Entity>,
    C extends Collection<any> = Collection<T & Entity>
> = (
        HasManyThroughHandler<Entity, T & Entity, C> & C
    )
