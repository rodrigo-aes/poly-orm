import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget, AutoGenProp } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function AutoIncrement(autoIncrement: boolean = true) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, AutoGenProp<number>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'auto-increment'
            )) (
                ColumnsMetadata
                    ?.findOrBuild(this.constructor as EntityTarget)
                    .set(context.name, { autoIncrement })
            )
        })
    }
}