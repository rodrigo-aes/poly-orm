import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import DecoratorMetadata from '../DecoratorMetadata'

// Types
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from '../../Entities'

export default function Id<T extends BaseEntity>(
    _: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<number>>
) {
    DecoratorMetadata
        .define(context.metadata)
        .col((target: EntityTarget) => ColumnsMetadata
            .findOrBuild(target)
            .registerColumnPattern(context.name as string, 'id')
        )
}