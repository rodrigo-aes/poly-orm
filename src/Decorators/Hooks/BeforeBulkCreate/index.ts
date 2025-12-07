import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { CreationAttributes } from "../../../SQLBuilders"

export default function BeforeBulkCreate<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: CreationAttributes<T>[]) => void | Promise<void>
    >
) {
    HooksMetadata.findOrBuild(target.constructor as EntityTarget)
        .addBeforeBulkCreate(propertyName)
}