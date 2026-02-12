import {
    RelationsMetadata,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BaseEntity } from "../../../Entities"
import type { HasOneThrough } from "../../../Relations"
import type { HasOneThroughOptions } from "./types"

export default function HasOneThrough(
    related: HasOneThroughRelatedGetter,
    through: HasOneThroughGetter,
    options: HasOneThroughOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
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

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.hasOneThrough(
                context.name as string
            )
        })
    }
}

export type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter
}