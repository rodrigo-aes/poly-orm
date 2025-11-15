import {
    PolymorphicRelationsMetadata,
    type IncludedCommonRelationOptions
} from "../../../Metadata"

// Types
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"
import type { PolymorphicEntityTarget } from "../../../types"

export default function CommonRelation(
    options?: IncludedCommonRelationOptions
) {
    return function <Entity extends BasePolymorphicEntity<any>>(
        target: Entity,
        name: string
    ) {
        PolymorphicRelationsMetadata.includeCommon(
            target.constructor as PolymorphicEntityTarget,
            name,
            options
        )
    }
}

export {
    type IncludedCommonRelationOptions
}