import type { Entity } from "../../types"
import type { PolymorphicHasManyHandler } from "./index"
import type { Collection } from "../../Entities"

export type PolymorphicHasMany<
    T extends Partial<Entity>,
    C extends Collection<any> = Collection<T & Entity>
> = (
        PolymorphicHasManyHandler<Entity, T & Entity, C> & C
    )