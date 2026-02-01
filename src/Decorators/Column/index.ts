import 'reflect-metadata'

import { ColumnsMetadata, type DataType } from '../../Metadata'
import DecoratorMetadata from '../DecoratorMetadata'

import type { EntityTarget, Prop } from '../../types'
import type { BaseEntity } from '../../Entities'

export default function Column(dataType: DataType) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                ?.findOrBuild(target)
                .registerColumn(context.name as string, dataType)
            )
    }
}