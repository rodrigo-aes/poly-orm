import 'reflect-metadata'

import {
    ColumnsMetadata,
    DataType,

    type ComputedType
} from '../../Metadata'
import DecoratorMeta from '../DecoratorMetadata'

// Types
import type { EntityTarget, Prop } from '../../types'
import type { BaseEntity } from '../../Entities'

export default function ComputedColumn(
    dataType: DataType,
    as: string,
    type: ComputedType = 'STORED'
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .registerColumn(
                    context.name as string,
                    DataType.COMPUTED(dataType, as, type)
                )
            )
    }
}