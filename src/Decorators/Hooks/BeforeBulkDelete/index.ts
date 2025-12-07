import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { ConditionalQueryOptions } from "../../../SQLBuilders"

export default function BeforeBulkDelete<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<T>
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkDelete(propertyName)
}