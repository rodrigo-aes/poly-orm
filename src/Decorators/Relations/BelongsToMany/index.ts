import {
    RelationsMetadata,
    type BelongsToManyRelatedGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BelongsToMany } from "../../../Relations"
import type { BelongsToManyOptions } from "./types"

export default function BelongsToMany(
    related: BelongsToManyRelatedGetter,
    options?: BelongsToManyOptions
) {
    return function <T extends Entity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, BelongsToMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addBelongsToMany({
                    name: context.name as string,
                    related,
                    ...options
                }))
    }
}

export type {
    BelongsToManyOptions,
    BelongsToManyRelatedGetter
}