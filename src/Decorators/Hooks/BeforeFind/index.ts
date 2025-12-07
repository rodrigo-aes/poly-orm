import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { FindQueryOptions } from "../../../SQLBuilders"

export default function BeforeFind<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: FindQueryOptions<T>) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeFind(propertyName)
}