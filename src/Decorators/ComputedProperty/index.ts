import {
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction
} from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { Entity, EntityTarget, Constructor, Prop } from "../../types"
import type { Collection, Pagination } from "../../Entities"

export default function ComputedProperty(fn: ComputedPropertyFunction) {
    return function <T extends Entity | Collection<any> | Pagination<any>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, Prop>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ComputedPropertiesMetadata
                .findOrBuild(target)
                .set(context.name as string, fn)
            )
    }
}

export type {
    ComputedPropertyFunction
}