import { ColumnsMetadata } from "../../Metadata"
import DecoratorMeta from "../DecoratorMetadata"

// Types
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicId<T extends BaseEntity>(
    _: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<string>>
) {
    DecoratorMeta
        .define(context.metadata)
        .col((target: EntityTarget) => ColumnsMetadata
            .findOrBuild(target)
            .registerColumnPattern(
                context.name as string,
                'polymorphic-id'
            )
        )
}