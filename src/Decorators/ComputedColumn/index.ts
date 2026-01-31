import 'reflect-metadata'

import {
    ColumnsMetadata,
    DataType,

    type ComputedType
} from '../../Metadata'

// Types
import type { EntityTarget, Prop } from '../../types'
import type { BaseEntity } from '../../Entities'

export default function ComputedColumn(
    dataType: DataType,
    as: string,
    type: ComputedType = 'STORED'
) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'computed-column'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .registerColumn(
                        context.name as string,
                        DataType.COMPUTED(dataType, as, type)
                    )
            )
        })
    }
}