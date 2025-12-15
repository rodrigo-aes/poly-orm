import type { Entity } from "../../../../types"
import type { Collection } from "../../../../Entities"
import type { CollectMapOptions } from "../types"

export type CreateCollectMapOptions<T extends Entity> = Omit<
    CollectMapOptions<T>,
    'mapTo'
>

export type CreateResult<
    T extends Entity,
    M extends CreateCollectMapOptions<T> | never
> = M extends never ?
    T
    : M extends CreateCollectMapOptions<T>
    ? M["collection"] extends Collection<any>
    ? M["collection"]
    : T['__defaultCollection']
    : never
