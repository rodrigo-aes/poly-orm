import { RelationsMetadata } from "../../../Metadata"
import DecoratorMetadata from "../../DecoratorMetadata"

import type { Entity, EntityTarget } from "../../../types"
import type { BaseEntity } from "../../../Entities"
import type { HasOneRelatedGetter } from "../../../Metadata"
import type { HasOne } from "../../../Relations"
import type { HasOneOptions } from "./types"

export default function HasOne(
    related: HasOneRelatedGetter,
    foreignKey: string | HasOneOptions
) {
    return function <T extends BaseEntity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, HasOne<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addHasOne({
                    name: context.name as string,
                    related,
                    ...typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                }))

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.hasOne(
                context.name as string
            )
        })
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter
}