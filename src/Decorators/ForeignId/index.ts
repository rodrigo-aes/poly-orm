import { ColumnsMetadata } from "../../Metadata"

import type { Entity, EntityTarget } from "../../types"
import type { ForeignIdRelatedGetter, ForeignIdOptions } from "./types"

export default function ForeignId(
    referenced: ForeignIdRelatedGetter,
    options?: ForeignIdOptions
) {
    return function <T extends Entity>(
        target: T,
        name: string
    ) {
        ColumnsMetadata.findOrBuild(target.constructor as EntityTarget)
            .registerColumnPattern(name, 'foreign-id', {
                referenced, ...options
            })
    }
}

export type {
    ForeignIdRelatedGetter,
    ForeignIdOptions
}