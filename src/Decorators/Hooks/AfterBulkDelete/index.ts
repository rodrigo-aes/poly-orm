import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { ConditionalQueryOptions } from "../../../SQLBuilders"
import type { DeleteResult } from '../../../Handlers'

export default function AfterBulkDelete<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        where: ConditionalQueryOptions<T>,
        result: DeleteResult
    ) => void | Promise<void>>
) {
    HooksMetadata
        .findOrBuild(target.constructor as EntityTarget)
        .add('afterBulkDelete', propertyName)
}