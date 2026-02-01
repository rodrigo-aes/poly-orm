import { RelationsMetadata } from "../../../../Metadata"
import DecoratorMetadata from "../../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { BaseEntity } from "../../../../Entities"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasOne } from "../../../../Relations"
import type { PolymorphicHasOneOptions } from "./types"

export default function PolymorphicHasOne(
    related: PolymorphicChildRelatedGetter,
    foreignKey: string | PolymorphicHasOneOptions
) {
    return function <T extends BaseEntity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, PolymorphicHasOne<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addPolymorphicHasOne({
                    name: context.name as string,
                    related,
                    ...(typeof foreignKey === 'string'
                        ? { foreignKey }
                        : foreignKey
                    )
                }))

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.polymorphicHasOne(
                context.name as string
            )
        })
    }
}

export type {
    PolymorphicHasOneOptions
}