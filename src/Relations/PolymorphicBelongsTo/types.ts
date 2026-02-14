import type { Entity } from "../../types"
import type {
    BasePolymorphicEntity,
    BaseEntity,
    SourceEntity
} from "../../Entities"

import type { PolymorphicBelongsToHandler } from "."

export type PolymorphicBelongsToRelated<
    T extends BaseEntity[] | BasePolymorphicEntity<any>
> = T extends BaseEntity[]
    ? BasePolymorphicEntity<T>
    : T

export type PolymorphicBelongsTo<
    T extends Partial<BasePolymorphicEntity<any>> | Partial<BaseEntity>[]
> = PolymorphicBelongsToHandler<Entity, PolymorphicBelongsToRelated<(
    T extends Partial<BaseEntity[]>
    ? Extract<T, BaseEntity[]>
    : T extends BasePolymorphicEntity<any>
    ? Extract<T, BasePolymorphicEntity<any>>
    : never
)>>