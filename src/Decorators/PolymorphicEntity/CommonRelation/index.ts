import {
    PolymorphicRelationsMetadata,
    type IncludedCommonRelationOptions
} from "../../../Metadata"

import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { PolymorphicEntityTarget } from "../../../types"
import type { BasePolymorphicEntity } from "../../../Entities"
import type { CommonRelationHandler } from "../../../Relations"

export default function CommonRelation(
    options?: IncludedCommonRelationOptions
) {
    return function <T extends BasePolymorphicEntity<any>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, CommonRelationHandler>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: PolymorphicEntityTarget) =>
                PolymorphicRelationsMetadata.includeCommon(
                    target,
                    context.name as string,
                    options
                )
            )
    }
}

export {
    type IncludedCommonRelationOptions
}