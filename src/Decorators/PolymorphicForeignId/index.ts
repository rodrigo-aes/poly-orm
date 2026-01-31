import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget, FKProp } from "../../types"
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
        column: undefined,
        context: ClassFieldDecoratorContext<T, FKProp<string>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'polymorphic-foreign-id'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .registerColumnPattern(
                        context.name as string,
                        'polymorphic-foreign-id',
                        { referenced, ...options }
                    )
            )
        })
    }
}

export type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
}