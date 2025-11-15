import {
    PolymorphicColumnsMetadata,
    type IncludeColumnOptions
} from "../../../Metadata"

// Types
import type BasePolymorphicEntity from "../../../BasePolymorphicEntity"
import type { PolymorphicEntityTarget } from "../../../types"

export default function Column(options?: IncludeColumnOptions) {
    return function <Entity extends BasePolymorphicEntity<any>>(
        target: Entity,
        name: string
    ) {
        PolymorphicColumnsMetadata.include(
            target.constructor as PolymorphicEntityTarget,
            name,
            options
        )
    }
}

export {
    type IncludeColumnOptions
}