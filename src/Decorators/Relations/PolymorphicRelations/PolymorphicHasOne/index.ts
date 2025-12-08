import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasOneOptions } from "./types"

export default function PolymorphicHasOne(
    related: PolymorphicChildRelatedGetter,
    foreignKey: string | PolymorphicHasOneOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicHasOne({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    PolymorphicHasOneOptions
}