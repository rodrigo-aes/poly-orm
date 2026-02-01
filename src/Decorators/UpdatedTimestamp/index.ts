import 'reflect-metadata'

import { ColumnsMetadata } from '../../Metadata'
import DecoratorMetadata from '../DecoratorMetadata'

// Types
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function UpdatedTimestamp<T extends BaseEntity>(
    _: undefined,
    context: ClassFieldDecoratorContext<T, Prop<Date>>
) {
    DecoratorMetadata
        .define(context.metadata)
        .col((target: EntityTarget) => ColumnsMetadata
            .findOrBuild(target)
            .registerColumnPattern(
                context.name as string, 'updated-timestamp'
            )
        )
}