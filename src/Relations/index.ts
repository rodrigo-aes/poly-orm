import type OneRelation from "./OneRelation"
import type ManyRelation from "./ManyRelation"

import HasOneHandler, {
    type HasOne
} from "./HasOne"

import HasManyHandler, {
    type HasMany
} from "./HasMany"

import BelongsToHandler, {
    type BelongsTo
} from "./BelongsTo"

import HasOneThroughHandler, {
    type HasOneThrough
} from "./HasOneThrough"

import HasManyThroughHandler, {
    type HasManyThrough
} from "./HasManyThrough"

import BelongsToThroughHandler, {
    type BelongsToThrough
} from "./BelongsToThrough"

import BelongsToManyHandler, {
    type BelongsToMany
} from "./BelongsToMany"

import PolymorphicHasOneHandler, {
    type PolymorphicHasOne
} from "./PolymorphicHasOne"

import PolymorphicHasManyHandler, {
    type PolymorphicHasMany
} from "./PolymorphicHasMany"

import PolymorphicBelongsToHandler, {
    type PolymorphicBelongsTo,
    type PolymorphicBelongsToRelated
} from "./PolymorphicBelongsTo"

export type RelationHandler = (
    OneRelation<any, any> | ManyRelation<any, any, any>
)

export {
    HasOneHandler,
    HasManyHandler,
    BelongsToHandler,
    HasOneThroughHandler,
    HasManyThroughHandler,
    BelongsToThroughHandler,
    BelongsToManyHandler,
    PolymorphicHasOneHandler,
    PolymorphicHasManyHandler,
    PolymorphicBelongsToHandler,

    type HasOne,
    type HasMany,
    type BelongsTo,
    type HasOneThrough,
    type HasManyThrough,
    type BelongsToThrough,
    type BelongsToMany,
    type PolymorphicHasOne,
    type PolymorphicHasMany,
    type PolymorphicBelongsTo,

    type PolymorphicBelongsToRelated
}