import { ColumnsMetadata } from "../../Metadata"
import DecoratorMeta from "../DecoratorMetadata"

// Types
import type { EntityTarget, Prop } from "../../types"
import type { ForeignKeyReferencedGetter } from "../../Metadata"
import type { BaseEntity } from "../../Entities"
import type { ForeignKeyConstraintOptions } from "./types"

export default function ForeignKey(
    referenced: ForeignKeyReferencedGetter,
    constrained: boolean | ForeignKeyConstraintOptions = true
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .defineForeignKey(context.name as string, {
                    referenced, ...typeof constrained === 'boolean'
                        ? { constrained }
                        : constrained
                })
            )
    }
}


export type {
    ForeignKeyReferencedGetter,
    ForeignKeyConstraintOptions
}