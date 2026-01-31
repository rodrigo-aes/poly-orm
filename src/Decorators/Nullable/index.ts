import { ColumnsMetadata } from "../../Metadata"
import DecoratorMeta from "../DecoratorMetadata"

// Types
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Nullable(
    nullable: boolean = true
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .set(context.name as string, { nullable })
            )
    }
}