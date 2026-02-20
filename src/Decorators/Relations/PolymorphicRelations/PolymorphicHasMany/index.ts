import { RelationsMetadata } from "../../../../Metadata"
import DecoratorMetadata from "../../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { BaseEntity } from "../../../../Entities"
import type { EntityTargetGetter } from "../../../../Metadata"
import type { PolymorphicHasMany } from "../../../../Relations"
import type { PolymorphicHasManyOptions } from "./types"

export default function PolymorphicHasMany(
    related: EntityTargetGetter,
    FK: string | PolymorphicHasManyOptions
) {
    return function <T extends BaseEntity, R extends Partial<Entity>>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, PolymorphicHasMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addPolymorphicHasMany({
                    name: context.name as string, related, ...(
                        typeof FK === 'string' ? { FK } : FK)
                }))

        // Initializer --------------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= this.polymorphicHasMany(
                context.name as string
            )
        })
    }
}

export type {
    PolymorphicHasManyOptions
}