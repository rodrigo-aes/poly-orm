import {
    RelationsMetadata,
    type BelongsToManyRelatedGetter
} from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BelongsToManyOptions } from "./types"

export default function BelongsToMany(
    related: BelongsToManyRelatedGetter,
    options?: BelongsToManyOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsToMany({ related, name, ...options })
    }
}

export type {
    BelongsToManyOptions,
    BelongsToManyRelatedGetter
}