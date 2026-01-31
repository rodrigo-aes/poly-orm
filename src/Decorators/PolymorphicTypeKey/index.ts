import {
    ColumnsMetadata,
    type PolymorphicTypeKeyRelateds
} from "../../Metadata"

// Types
import type { EntityTarget, AutoGenProp, TKProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicTypeKey<
    R extends PolymorphicTypeKeyRelateds
>(...relateds: R) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, TKProp<R>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'polymorphic-type-key'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .registerColumnPattern(
                        context.name as string,
                        'polymorphic-type-key',
                        relateds
                    )
            )
        })
    }
}

export type {
    PolymorphicTypeKeyRelateds
}