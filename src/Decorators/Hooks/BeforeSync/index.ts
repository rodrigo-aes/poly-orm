import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"

export default function BeforeSync<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<() => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeSync(propertyName)
}