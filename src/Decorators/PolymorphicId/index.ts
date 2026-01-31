import { ColumnsMetadata } from "../../Metadata"

import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function PolymorphicId<T extends BaseEntity>(
    column: undefined,
    context: ClassFieldDecoratorContext<T, AutoGenProp<string>>
) {
    context.addInitializer(function (this: T) {
        if ((this.constructor as any).shouldRegisterMeta(
            context.name, 'polymorphic-id'
        )) (
            ColumnsMetadata
                .findOrBuild(this.constructor as EntityTarget)
                .registerColumnPattern(
                    context.name as string,
                    'polymorphic-id'
                )
        )
    })
}