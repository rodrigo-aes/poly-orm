import { RelationsMetadata } from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

import type { Entity, EntityTarget } from "../../../types"
import type { HasManyRelatedGetter } from "../../../Metadata"
import type { BaseEntity } from "../../../Entities"
import type { HasMany } from "../../../Relations"
import type { HasManyOptions } from "./types"

export default function HasMany(
    related: HasManyRelatedGetter,
    foreignKey: string | HasManyOptions
) {
    return function <T extends BaseEntity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, HasMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addHasMany({
                    name: context.name as string,
                    related,
                    ...(typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey)
                }))

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.hasMany(
                context.name as string
            )
        })
    }
}

export type {
    HasManyOptions,
    HasManyRelatedGetter
}