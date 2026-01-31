import { RelationsMetadata } from "../../../Metadata"

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
        relation: undefined,
        context: ClassFieldDecoratorContext<T, HasMany<R>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name as string
            )) (
                RelationsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .addHasMany({
                        name: context.name as string,
                        related,
                        ...(typeof foreignKey === 'string'
                            ? { foreignKey }
                            : foreignKey)
                    })
            )
        })
    }
}

export type {
    HasManyOptions,
    HasManyRelatedGetter
}