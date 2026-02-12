import {
    RelationsMetadata,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BaseEntity } from "../../../Entities"
import type { HasManyThrough } from "../../../Relations"
import type { HasManyThroughOptions } from "./types"

export default function HasManyThrough(
    related: HasManyThroughRelatedGetter,
    through: HasManyThroughGetter,
    options: HasManyThroughOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, HasManyThrough<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addHasManyThrough({
                    name: context.name as string,
                    related,
                    through,
                    ...options
                }))

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.hasManyThrough(
                context.name as string
            )
        })
    }
}

export type {
    HasManyThroughOptions,
    HasManyThroughRelatedGetter,
    HasManyThroughGetter
}