import type { Entity } from "../../../../types"
import type { Collection } from "../../../../Entities"
import type {
    CollectMapOptions,
    ResolveCollection,
    EntityCollectOption
} from "../types"

export type CreationCollectMapOptions<T extends Entity> = Omit<
    CollectMapOptions<T>,
    'mapTo'
>

export type CreateResult<
    T extends Entity,
    M extends EntityCollectOption<T>
> = ResolveCollection<T, M>
