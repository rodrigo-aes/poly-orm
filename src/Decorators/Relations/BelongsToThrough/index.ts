import {
    RelationsMetadata,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter
} from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BelongsToThroughOptions } from "./types"

export default function BelongsToThrough(
    related: BelongsToThroughRelatedGetter,
    through: BelongsToThroughGetter,
    options: BelongsToThroughOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsToThrough({ name, related, through, ...options })
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter
}