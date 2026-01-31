import 'reflect-metadata'
import { EntityMetadata } from '../../Metadata'
import DecoratorMeta from '../DecoratorMetadata'

// Types
import type { EntityTarget } from '../../types'
import type { EntityDecoratorContext } from '../types'

export default function Entity(tableName?: string) {
    return function (target: EntityTarget, context: EntityDecoratorContext) {
        EntityMetadata.findOrBuild(target, tableName)
        DecoratorMeta.define(context.metadata).register(target)
    }
}