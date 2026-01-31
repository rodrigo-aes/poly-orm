import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function UpdatedTimestamp<T extends BaseEntity>(
    column: undefined,
    context: ClassFieldDecoratorContext<T, Prop<Date>>
) {
    context.addInitializer(function (this: T) {
        if ((this.constructor as any).shouldRegisterMeta(
            context.name, 'updated-timestamp'
        )) (
            ColumnsMetadata
                .findOrBuild(this.constructor as EntityTarget)
                .registerColumnPattern(
                    context.name as string, 'updated-timestamp'
                )
        )
    })
}