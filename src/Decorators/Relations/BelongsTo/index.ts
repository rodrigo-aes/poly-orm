import { RelationsMetadata } from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

import type { Entity, EntityTarget } from "../../../types"
import type { BelongsToRelatedGetter } from "../../../Metadata"
import type { BelongsTo } from "../../../Relations"
import type { BelongToOptions } from "./types"

export default function BelongsTo(
    related: BelongsToRelatedGetter,
    foreignKey: string | BelongToOptions
) {
    return function <T extends Entity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, BelongsTo<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addBelongsTo({
                    name: context.name as string,
                    related,
                    ...(typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                    )
                }))
    }
}

export type {
    BelongToOptions,
    BelongsToRelatedGetter
}