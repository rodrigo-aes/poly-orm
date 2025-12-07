import {
    RelationsMetadata,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter
} from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { HasOneThroughOptions } from "./types"

export default function HasOneThrough(
    related: HasOneThroughRelatedGetter,
    through: HasOneThroughGetter,
    options: HasOneThroughOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasOneThrough({ name, related, through, ...options })
    }
}

export type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter
}