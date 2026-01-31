import {
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction
} from "../../Metadata"

// Types
import type { Entity, Constructor, Prop } from "../../types"
import type { Collection, Pagination } from "../../Entities"

export default function ComputedProperty(fn: ComputedPropertyFunction) {
    return function <T extends Entity | Collection<any> | Pagination<any>>(
        prop: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name, 'computed-property'
            )) (
                ComputedPropertiesMetadata
                    .findOrBuild(this.constructor as Constructor<T>)
                    .set(context.name as string, fn)
            )
        })
    }
}

export type {
    ComputedPropertyFunction
}