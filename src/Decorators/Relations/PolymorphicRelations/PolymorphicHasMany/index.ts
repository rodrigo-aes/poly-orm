import { RelationsMetadata } from "../../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasManyOptions } from "./types"

export default function PolymorphicHasMany(
    related: PolymorphicChildRelatedGetter,
    foreignKey: string | PolymorphicHasManyOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addPolymorphicHasMany({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    PolymorphicHasManyOptions
}