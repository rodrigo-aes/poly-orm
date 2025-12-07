import {
    RelationsMetadata,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter
} from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { HasManyThroughOptions } from "./types"

export default function HasManyThrough(
    related: HasManyThroughRelatedGetter,
    through: HasManyThroughGetter,
    options: HasManyThroughOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasManyThrough({ name, related, through, ...options })
    }
}

export type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter
}