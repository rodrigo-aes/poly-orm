import 'reflect-metadata'

import { ColumnsMetadata, type DataType } from '../../Metadata'
import type { EntityTarget, Prop } from '../../types'
import type { BaseEntity } from '../../Entities'

export default function Column(dataType: DataType) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(context.name)) (
                ColumnsMetadata
                    ?.findOrBuild(this.constructor as EntityTarget)
                    .registerColumn(context.name as string, dataType)
            )
        })
    }
}