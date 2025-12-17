import {
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction
} from "../../Metadata"

// Types
import type { Entity, Constructor } from "../../types"
import type { Collection, Pagination } from "../../Entities"

export default function ComputedProperty(fn: ComputedPropertyFunction) {
    return function <T extends Entity | Collection<any> | Pagination<any>>(
        target: T,
        name: string
    ) {
        ComputedPropertiesMetadata
            .findOrBuild(target.constructor as Constructor<T>)
            .set(name, fn)
    }
}

export type {
    ComputedPropertyFunction
}