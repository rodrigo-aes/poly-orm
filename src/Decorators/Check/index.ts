import { ColumnsMetadata } from "../../Metadata"
import DecoratorMeta from "../DecoratorMetadata"

import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Check(...constraints: string[]) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                ?.findOrBuild(target)
                .addCheck(context.name as string, ...constraints)
            )
    }
}