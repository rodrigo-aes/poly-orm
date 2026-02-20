import {
    RelationsMetadata,
    type TargetGetter,
    type EntityTargetGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BaseEntity } from "../../../Entities"
import type { BelongsToThrough } from "../../../Relations"
import type { BelongsToThroughOptions } from "./types"

export default function BelongsToThrough(
    related: TargetGetter,
    through: EntityTargetGetter,
    options: BelongsToThroughOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, BelongsToThrough<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addBelongsToThrough({
                    name: context.name as string, related, through, ...options
                }))

        // Initializer --------------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.belongsToThrough(
                context.name as string
            )
        })
    }
}

export type {
    BelongsToThroughOptions
}