import {
    PolymorphicRelationsMetadata,
    type IncludePolymorphicRelationOptions
} from "../../../Metadata"

// Types
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"
import type { PolymorphicEntityTarget } from "../../../types"

export default function PolymorphicRelation(
    options?: IncludePolymorphicRelationOptions
) {
    return function <Entity extends BasePolymorphicEntity<any>>(
        target: Entity,
        name: string
    ) {
        PolymorphicRelationsMetadata.includePolymorphic(
            target.constructor as PolymorphicEntityTarget,
            name,
            options
        )
    }
}

export {
    type IncludePolymorphicRelationOptions
}