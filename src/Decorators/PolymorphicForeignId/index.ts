import { ColumnsMetadata } from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"
import type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
} from "./types"

export default function PolymorphicForeignId(
    referenced: PolymorphicForeignIdRelatedGetter,
    options?: PolymorphicForeignIdOptions
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop<string>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .registerColumnPattern(
                    context.name as string,
                    'polymorphic-foreign-id',
                    { referenced, ...options }
                )
            )
    }
}

export type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
}