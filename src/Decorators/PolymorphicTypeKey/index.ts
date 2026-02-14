import {
    ColumnsMetadata,
    type PolymorphicTypeKeyRelateds
} from "../../Metadata"

import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, TK, Constructor } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicTypeKey<R extends BaseEntity[]>(
    ...relateds: Constructor<R[number]>[]
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, TK<R>>
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