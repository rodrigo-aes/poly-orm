import { RelationsMetadata } from "../../../Metadata"

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
        relation: undefined,
        context: ClassFieldDecoratorContext<T, HasOne<R>>
    ) {
        context.addInitializer(function (this: T) {
            if ((this.constructor as any).shouldRegisterMeta(
                context.name as string
            )) (
                RelationsMetadata
                    .findOrBuild(this.constructor as EntityTarget)
                    .addHasOne({
                        name: context.name as string,
                        related,
                        ...typeof foreignKey === 'string'
                            ? { foreignKey }
                            : foreignKey
                    })
            )
        })
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter
}