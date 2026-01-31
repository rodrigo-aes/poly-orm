import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget, Prop } from "../../types"
import type { ForeignKeyReferencedGetter } from "../../Metadata"
import type { BaseEntity } from "../../Entities"
import type { ForeignKeyConstraintOptions } from "./types"

export default function ForeignKey(
    referenced: ForeignKeyReferencedGetter,
    constrained: boolean | ForeignKeyConstraintOptions = true
) {
    return function <T extends BaseEntity>(
        prop: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'foreign-key'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .defineForeignKey(context.name as string, {
                        referenced, ...typeof constrained === 'boolean'
                            ? { constrained }
                            : constrained
                    })
            )
        })
    }
}

export type {
    ForeignKeyReferencedGetter,
    ForeignKeyConstraintOptions
}