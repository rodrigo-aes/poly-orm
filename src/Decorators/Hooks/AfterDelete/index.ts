import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { DeleteResult } from "../../../Handlers"

export default function AfterDelete<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<(
        entity: T,
        result: DeleteResult
    ) => void | Promise<void>>
) {
    HooksMetadata
        .findOrBuild(target.constructor as EntityTarget)
        .add('afterDelete', propertyName)
}
