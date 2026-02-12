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

import type { RelationHandler } from "./types"

export type CommonRelationHandler = (
    HasOne<any> |
    HasMany<any> |
    BelongsTo<any> |
    HasOneThrough<any> |
    HasManyThrough<any> |
    BelongsToThrough<any> |
    BelongsToMany<any, any>
)

export type PolymorphicRelationHandler = (
    PolymorphicHasOne<any> |
    PolymorphicHasMany<any, any> |
    PolymorphicBelongsTo<any>
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

    type RelationHandler,

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