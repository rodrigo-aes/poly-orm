import { ColumnsMetadata } from "../../Metadata"
import type { EntityTarget, Prop } from "../../types"
import type { BaseEntity } from "../../Entities"

export default function Primary(primary: boolean = true) {
    return function <T extends BaseEntity>(
        column: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'primary'
            )) (
                ColumnsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .set(context.name as string, { primary })
            )
        })
    }
}