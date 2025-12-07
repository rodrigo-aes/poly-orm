import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"

export default function AfterFind<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (entity: T) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addAfterFind(propertyName)
}