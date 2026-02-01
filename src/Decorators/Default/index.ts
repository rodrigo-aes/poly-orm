import { ColumnsMetadata } from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Default(value: any) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .set(context.name as string, { defaultValue: value })
            )
    }
}