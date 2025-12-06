import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../types"
import type { HasOneRelatedGetter } from "../../../Metadata"
import type { HasOneOptions } from "./types"

export default function HasOne(
    related: HasOneRelatedGetter,
    foreignKey: HasOneOptions
) {
    return function <Entity extends object>(
        target: Entity,
        name: string
    ) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasOne({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter
}