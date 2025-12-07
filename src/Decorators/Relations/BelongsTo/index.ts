import { RelationsMetadata } from "../../../Metadata"

import type { Entity, EntityTarget } from "../../../types"
import type { BelongsToRelatedGetter } from "../../../Metadata"
import type { BelongToOptions } from "./types"

export default function BelongsTo(
    related: BelongsToRelatedGetter,
    foreignKey: string | BelongToOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addBelongsTo({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    BelongToOptions,
    BelongsToRelatedGetter
}