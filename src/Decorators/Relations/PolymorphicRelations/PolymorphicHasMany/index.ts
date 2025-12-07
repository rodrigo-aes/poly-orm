import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasManyOptions } from "./types"

export default function PolymorphicHasMany(
    related: PolymorphicChildRelatedGetter,
    options: PolymorphicHasManyOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicHasMany({ name, related, ...options })
    }
}

export type {
    PolymorphicHasManyOptions
}