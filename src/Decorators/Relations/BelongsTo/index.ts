import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../types"
import type { BelongsToRelatedGetter } from "../../../Metadata"
import type { BelongToOptions } from "./types"

export default function BelongsTo(
    related: BelongsToRelatedGetter,
    foreignKey: string | BelongToOptions
) {
    return function <Entity extends object>(
        target: Entity,
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