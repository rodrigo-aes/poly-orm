import { HooksMetadata } from "../../../Metadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { CreateAttributes } from "../../../SQLBuilders"

export default function BeforeCreate<T extends Entity>(
    target: T,
    propertyName: string,
    hookFn: TypedPropertyDescriptor<
        (options: CreateAttributes<T>) => void | Promise<void>
    >
) {
    HooksMetadata
        .findOrBuild(target.constructor as EntityTarget)
        .add('beforeCreate', propertyName)
}
