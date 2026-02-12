import { RelationsMetadata } from "../../../../Metadata"
import DecoratorMetadata from "../../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { BaseEntity, BasePolymorphicEntity } from "../../../../Entities"
import type { PolymorphicParentRelatedGetter } from "../../../../Metadata"
import type { PolymorphicBelongsTo } from "../../../../Relations"
import type { PolymorphicBelongsToOptions } from "./types"

export default function PolymorphicBelongsTo(
    related: PolymorphicParentRelatedGetter,
    foreignKey: string | PolymorphicBelongsToOptions
) {
    return function <
        T extends BaseEntity,
        R extends Partial<BasePolymorphicEntity<any>> | Partial<BaseEntity>[]
    >(
        _: undefined,
        context: ClassFieldDecoratorContext<T, PolymorphicBelongsTo<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addPolymorphicBelongsTo({
                    name: context.name as string,
                    related, ...(
                        typeof foreignKey === 'string'
                            ? { foreignKey }
                            : foreignKey
                    )
                }))

        // Auto-initialize ----------------------------------------------------
        context.addInitializer(function (this: T) {
            (this[context.name as keyof T] as any) ??= (
                this.polymorphicBelongsTo(context.name as string)
            )
        })
    }
}

export type {
    PolymorphicBelongsToOptions
}