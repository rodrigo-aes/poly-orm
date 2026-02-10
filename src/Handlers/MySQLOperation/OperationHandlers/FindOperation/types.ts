import type { Entity } from "../../../../types"
import type { CollectMapOptions, ResolveCollection } from "../types"
import type { EntityJSON } from "../../../../types"

export type FindResult<
    T extends Entity,
    M extends CollectMapOptions<T>
> = M extends CollectMapOptions<T>
    ? M['mapTo'] extends 'entity'
    ? ResolveCollection<T, M['collection']>
    : M['mapTo'] extends 'json'
    ? EntityJSON<T, T['hidden']>[]
    : M['mapTo'] extends 'raw'
    ? any[]
    : ResolveCollection<T, M['collection']>
    : never