import { RelationsMetadata } from "../../../../Metadata"
import DecoratorMetadata from "../../../DecoratorMetadata"

// Types
import type { Entity, EntityTarget } from "../../../../types"
import type { PolymorphicChildRelatedGetter } from "../../../../Metadata"
import type { PolymorphicHasMany } from "../../../../Relations"
import type { PolymorphicHasManyOptions } from "./types"

export default function PolymorphicHasMany(
    related: PolymorphicChildRelatedGetter,
    foreignKey: string | PolymorphicHasManyOptions
) {
    return function <T extends Entity, R extends Entity>(
        _: undefined,
        context: ClassFieldDecoratorContext<T, PolymorphicHasMany<R>>
    ) {
        DecoratorMetadata
            .define(context.metadata)
            .rel((target: EntityTarget) => RelationsMetadata
                .findOrBuild(target)
                .addPolymorphicHasMany({
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
    PolymorphicHasManyOptions
}