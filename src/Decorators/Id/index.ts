import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from '../../Entities'

export default function Id<T extends BaseEntity>(
    column: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<number>>
) {
    context.addInitializer(function (this: T) {
        if ((this.constructor as any).shouldRegisterMeta(
            context.name, 'id'
        )) (
            ColumnsMetadata
                .findOrBuild(this.constructor as EntityTarget)
                .registerColumnPattern(context.name as string, 'id')
        )
    })
}