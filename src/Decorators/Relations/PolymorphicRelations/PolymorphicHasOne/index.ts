import { RelationsMetadata } from "../../../../Metadata"
import DecoratorMetadata from "../../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasOne } from "../../../../Relations"
import type { PolymorphicHasOneOptions } from "./types"

export default function PolymorphicHasOne(
    related: PolymorphicChildRelatedGetter,
    foreignKey: string | PolymorphicHasOneOptions
) {
    return function <T extends Entity, R extends Entity>(
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
    }
}

export type {
    PolymorphicHasOneOptions
}