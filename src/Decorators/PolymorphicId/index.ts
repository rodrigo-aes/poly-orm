import { ColumnsMetadata } from "../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../types"

export default function PolymorphicId<T extends Entity>(
    target: T,
    name: string
) {
    ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
        .registerColumnPattern(name, 'polymorphic-id')
}