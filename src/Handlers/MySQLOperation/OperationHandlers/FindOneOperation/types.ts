import type { Entity, Target } from "../../../../types"
import type { MapOptions } from "../types"
import type { EntityJSON } from "../../../../types"

export type FindOneResult<
    T extends Entity,
    M extends MapOptions
> = (
        M['mapTo'] extends 'entity' | undefined
        ? T | null
        : M['mapTo'] extends 'json'
        ? EntityJSON<T>
        : M['mapTo'] extends 'raw'
        ? any[]
        : T
    )