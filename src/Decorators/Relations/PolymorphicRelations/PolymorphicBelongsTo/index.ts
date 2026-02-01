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
        T extends Entity,
        R extends BasePolymorphicEntity<any> | BaseEntity[]
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
    }
}

export type {
    PolymorphicBelongsToOptions
}