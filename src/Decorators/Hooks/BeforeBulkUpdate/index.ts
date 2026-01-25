import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type {
    UpdateAttributes,
    ConditionalQueryOptions
} from "../../../SQLBuilders"

export default function BeforeBulkUpdate<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        attributes: UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) => void | Promise<void>>
) {
    HooksMetadata
        .findOrBuild(target.constructor as EntityTarget)
        .add('beforeBulkUpdate', propertyName)
}