import {
    PolymorphicRelationsMetadata,
    type IncludePolymorphicRelationOptions
} from "../../../Metadata"

import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types"
import type { BasePolymorphicEntity } from "../../../Entities"
import type { PolymorphicRelationHandler } from "../../../Relations"

export default function PolymorphicRelation(
    options?: IncludePolymorphicRelationOptions
) {
    return function <T extends BasePolymorphicEntity<any>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, PolymorphicRelationHandler>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: PolymorphicEntityTarget) =>
                PolymorphicRelationsMetadata.includePolymorphic(
                    target,
                    context.name as string,
                    options
                )
            )
    }
}

export {
    type IncludePolymorphicRelationOptions
}