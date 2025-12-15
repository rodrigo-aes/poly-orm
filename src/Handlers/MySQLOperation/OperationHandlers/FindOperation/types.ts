import type { Entity } from "../../../../types"
import type { CollectMapOptions } from "../types"
import type { EntityJSON } from "../../../../types"
import type { Collection } from "../../../../Entities"

type ResolveCollection<
    T extends Entity,
    C extends Collection<any> | undefined
> = C extends Collection<any>
    ? C
    : T['__defaultCollection']

export type FindResult<
    T extends Entity,
    M extends CollectMapOptions<T> = { mapTo: 'entity' }
> = M extends CollectMapOptions<T>
    ? M['mapTo'] extends 'entity'
    ? ResolveCollection<T, M['collection']>
    : M['mapTo'] extends 'json'
    ? EntityJSON<T, T['hidden']>[]
    : M['mapTo'] extends 'raw'
    ? any[]
    : never
    : never
