import { ColumnsMetadata } from "../../Metadata"
import DecoratorMeta from "../DecoratorMetadata"

import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function AutoIncrement(autoIncrement: boolean = true) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, AutoGenProp<number>>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                ?.findOrBuild(target)
                .set(context.name, { autoIncrement })
            )
    }
}