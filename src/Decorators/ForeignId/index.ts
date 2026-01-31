import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget, FKProp } from "../../types"
import type { ForeignIdRelatedGetter, ForeignIdOptions } from "./types"
import type { BaseEntity } from "../../Entities"

export default function ForeignId(
    referenced: ForeignIdRelatedGetter,
    options?: ForeignIdOptions
) {
    return function <T extends BaseEntity>(
        prop: undefined,
        context: ClassFieldDecoratorContext<T, FKProp<number>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'foreign-id'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .registerColumnPattern(
                        context.name as string,
                        'foreign-id',
                        {
                            referenced, ...options
                        }
                    )
            )
        })
    }
}

export type {
    ForeignIdRelatedGetter,
    ForeignIdOptions
}