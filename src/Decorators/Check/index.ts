import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Check(...constraints: string[]) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'check'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .addCheck(context.name as string, ...constraints)
            )
        })
    }
}