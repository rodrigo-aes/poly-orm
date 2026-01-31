import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Default(value: any) {
    return function <T extends BaseEntity>(
        prop: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'default'
            )) (
                ColumnsMetadata.findOrBuild(this.constructor as EntityTarget)
                    .set(context.name as string, { defaultValue: value })
            )
        })
    }
}