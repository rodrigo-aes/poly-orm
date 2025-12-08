import { RelationsMetadata } from "../../../Metadata"

import type { Entity, EntityTarget } from "../../../types"
import type { HasOneRelatedGetter } from "../../../Metadata"
import type { HasOneOptions } from "./types"

export default function HasOne(
    related: HasOneRelatedGetter,
    foreignKey: string | HasOneOptions
) {
    return function <T extends Entity>(
        target: T,
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