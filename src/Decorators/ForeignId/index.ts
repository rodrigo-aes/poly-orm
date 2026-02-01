import { ColumnsMetadata } from "../../Metadata"
import DecoratorMetadata from "../DecoratorMetadata"

// Types
import type { EntityTarget, FKProp } from "../../types"
import type { ForeignIdRelatedGetter, ForeignIdOptions } from "./types"
import type { BaseEntity } from "../../Entities"

export default function ForeignId(
    referenced: ForeignIdRelatedGetter,
    options?: ForeignIdOptions
) {
    return function <T extends BaseEntity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, FKProp<number>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .col((target: EntityTarget) => ColumnsMetadata
                .findOrBuild(target)
                .registerColumnPattern(
                    context.name as string,
                    'foreign-id',
                    {
                        referenced, ...options
                    }
                )
            )
    }
}

export type {
    ForeignIdRelatedGetter,
    ForeignIdOptions
}