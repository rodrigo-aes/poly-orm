import { ColumnsMetadata } from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicId<T extends BaseEntity>(
    _: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<string>>
) {
    DecoratorMetadata
        .define(context.metadata)
        .col((target: EntityTarget) => ColumnsMetadata
            .findOrBuild(target)
            .registerColumnPattern(
                context.name as string,
                'polymorphic-id'
            )
        )
}