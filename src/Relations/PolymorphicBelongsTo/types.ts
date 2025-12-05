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
    T extends BasePolymorphicEntity<any> | BaseEntity[]
> = PolymorphicBelongsToHandler<Entity, T> & (
    T extends BaseEntity[]
    ? SourceEntity<T>
    : T
)