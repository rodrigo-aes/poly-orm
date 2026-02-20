import { RelationsMetadata } from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

import type { Entity, EntityTarget } from "../../../types"
import type { TargetGetter } from "../../../Metadata"
import type { BaseEntity } from "../../../Entities"
import type { HasMany } from "../../../Relations"
import type { HasManyOptions } from "./types"

export default function HasMany(
    related: TargetGetter,
    FK: string | HasManyOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, HasMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addHasMany({
                    name: context.name as string, related, ...(
                        typeof FK === 'string' ? { FK } : FK
                    )
                }))

        // Initializer --------------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.hasMany(
                context.name as string
            )
        })
    }
}

export type {
    HasManyOptions
}