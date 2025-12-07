import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"

export default function AfterBulkFind<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (entities: T[]) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterBulkFind(propertyName)
}