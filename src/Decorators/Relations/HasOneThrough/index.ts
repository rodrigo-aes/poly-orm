import {
    RelationsMetadata,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { HasOneThrough } from "../../../Relations"
import type { HasOneThroughOptions } from "./types"

export default function HasOneThrough(
    related: HasOneThroughRelatedGetter,
    through: HasOneThroughGetter,
    options: HasOneThroughOptions
) {
    return function <T extends Entity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, HasOneThrough<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addHasOneThrough({
                    name: context.name as string,
                    related,
                    through,
                    ...options
                }))
    }
}

export type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter
}