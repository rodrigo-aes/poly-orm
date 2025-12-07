import {
    ColumnsMetadata,
    type PolymorphicTypeKeyRelateds
} from "../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../types"

export default function PolymorphicTypeKey(
    relateds: PolymorphicTypeKeyRelateds
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'polymorphic-type-key', relateds)
    }
}

export type {
    PolymorphicTypeKeyRelateds
}