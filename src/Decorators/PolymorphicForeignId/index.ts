import { ColumnsMetadata } from "../../Metadata"

import type { Entity, EntityTarget } from "../../types"
import type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
} from "./types"

export default function PolymorphicForeignId(
    referenced: PolymorphicForeignIdRelatedGetter,
    options?: PolymorphicForeignIdOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'polymorphic-foreign-id', {
                referenced, ...options
            })
    }
}

export type {
    PolymorphicForeignIdRelatedGetter,
    PolymorphicForeignIdOptions
}