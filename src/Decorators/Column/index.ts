import 'reflect-metadata'

import { ColumnsMetadata, type DataType } from '../../Metadata'
import DecoratorMeta from '../DecoratorMetadata'

import type { EntityTarget, Prop } from '../../types'
import type { BaseEntity } from '../../Entities'
import type { EntityFieldDecoratorContext } from '../types'

export default function Column(dataType: DataType) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: EntityFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMeta
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                ?.findOrBuild(target)
                .registerColumn(context.name as string, dataType)
            )
    }
}