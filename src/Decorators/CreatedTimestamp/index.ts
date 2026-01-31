import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import DecoratorMeta from '../DecoratorMetadata'

// Types
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function CreatedTimestamp<T extends BaseEntity>(
    prop: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<Date>>
) {
    DecoratorMeta
        .define(context.metadata)
        .col((target: EntityTarget) => ColumnsMetadata
            .findOrBuild(target)
            .registerColumnPattern(context.name as string, 'created-timestamp')
        )
}