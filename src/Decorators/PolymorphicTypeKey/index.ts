import {
    ColumnsMetadata,
    type PolymorphicTypeKeyRelateds
} from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, AutoGenProp, TKProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicTypeKey<
    R extends PolymorphicTypeKeyRelateds
>(...relateds: R) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, TKProp<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .registerColumnPattern(
                    context.name as string,
                    'polymorphic-type-key',
                    relateds
                )
            )
    }
}

export type {
    PolymorphicTypeKeyRelateds
}