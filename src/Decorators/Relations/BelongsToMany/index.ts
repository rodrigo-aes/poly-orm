import {
    RelationsMetadata,
    type EntityTargetGetter
} from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../types"
import type { BaseEntity } from "../../../Entities"
import type { BelongsToMany } from "../../../Relations"
import type { BelongsToManyOptions } from "./types"

export default function BelongsToMany(
    related: EntityTargetGetter,
    options?: BelongsToManyOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, BelongsToMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addBelongsToMany({
                    name: context.name as string, related, ...options
                }))

        // Initializer --------------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.belongsToMany(
                context.name as string
            )
        })
    }
}

export type {
    BelongsToManyOptions
}