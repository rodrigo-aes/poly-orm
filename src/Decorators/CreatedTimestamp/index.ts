import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function CreatedTimestamp<T extends BaseEntity>(
    prop: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<Date>>
) {
    context.addInitializer(function (this: T) {
        if ((this.constructor as any).shouldRegisterMeta(
            context.name, 'created-timestamp'
        )) (
            ColumnsMetadata.findOrBuild(this.constructor as EntityTarget)
                .registerColumnPattern(context.name as string, 'created-timestamp')
        )
    })
}