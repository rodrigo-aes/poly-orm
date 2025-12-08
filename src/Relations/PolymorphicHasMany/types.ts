import type { Entity } from "../../types"
import type { PolymorphicHasManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type PolymorphicHasMany<
    T extends Entity,
    C extends Collection<T> = Collection<T>
> = (
        PolymorphicHasManyHandler<Entity, T, C> & C
    )