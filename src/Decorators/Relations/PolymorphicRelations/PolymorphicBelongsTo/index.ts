import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicParentRelatedGetter } from "../../../../Metadata"
import type { PolymorphicBelongsToOptions } from "./types"

export default function PolymorphicBelongsTo(
    related: PolymorphicParentRelatedGetter,
    foreignKey: string | PolymorphicBelongsToOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicBelongsTo({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    PolymorphicBelongsToOptions
}