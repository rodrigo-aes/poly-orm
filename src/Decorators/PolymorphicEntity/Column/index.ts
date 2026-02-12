import {
    PolymorphicColumnsMetadata,
    type IncludeColumnOptions
} from "../../../Metadata"

import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { BasePolymorphicEntity } from "../../../Entities"
import type { PolymorphicEntityTarget } from "../../../types"

export default function Column(options?: IncludeColumnOptions) {
    return function <T extends BasePolymorphicEntity<any>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, string>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: PolymorphicEntityTarget) =>
                PolymorphicColumnsMetadata.include(
                    target,
                    context.name as string,
                    options
                )
            )
    }
}

export {
    type IncludeColumnOptions
}