import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type {
    UpdateAttributes,
    ConditionalQueryOptions
} from "../../../SQLBuilders"

export default function BeforeUpdate<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        attributes: T | UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) => void | Promise<void>>
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeUpdate(propertyName)
}