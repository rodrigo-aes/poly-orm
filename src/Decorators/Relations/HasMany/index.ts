import { RelationsMetadata } from "../../../Metadata"

import type { EntityTarget } from "../../../types"
import type { HasManyRelatedGetter } from "../../../Metadata"
import type { HasManyOptions } from "./types"

export default function HasMany(
    related: HasManyRelatedGetter,
    foreignKey: HasManyOptions
) {
    return function <Entity extends object>(target: Entity, name: string) {
        RelationsMetadata.findOrBuild(target.constructor as EntityTarget)
            .addHasMany({
                name, related, ...(
                    typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                )
            })
    }
}

export type {
    HasManyOptions,
    HasManyRelatedGetter
}