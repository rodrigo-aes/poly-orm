import type { Entity } from "../../types"
import type { BasePolymorphicEntity } from "../../Entities"

import type HasOneHandlerSQLBuilder from "./HasOneHandlerSQLBuilder"
import type HasManyHandlerSQLBuilder from "./HasManyHandlerSQLBuilder"
import type BelongsToHandlerSQLBuilder from "./BelongsToHandlerSQLBuilder"
import type HasOneThroughHandlerSQLBuilder from "./HasOneThroughHandlerSQLBuilder"
import type HasManyThroughHandlerSQLBuilder from "./HasManyThroughHandlerSQLBuilder"
import type BelongsToThroughHandlerSQLBuilder from "./BelongsToThroughHandlerSQLBuilder"
import type BelongsToManyHandlerSQLBuilder from "./BelongsToManyHandlerSQLBuilder"
import type PolymorphicHasOneHandlerSQLBuilder from "./PolymorphicHasOneHandlerSQLBuilder"
import type PolymorphicHasManyHandlerSQLBuilder from "./PolymorphicHasManyHandlerSQLBuilder"
import type PolymorphicBelongsToHandlerSQLBuilder from "./PolymorphicBelongsToHandlerSQLBuilder"

export type OneRelationHandlerSQLBuilder<
    T extends Entity = any,
    R extends Entity = any
> = (
        HasOneHandlerSQLBuilder<T, R> |
        BelongsToHandlerSQLBuilder<T, R> |
        HasOneThroughHandlerSQLBuilder<T, R> |
        BelongsToThroughHandlerSQLBuilder<T, R> |
        PolymorphicHasOneHandlerSQLBuilder<T, R> |
        PolymorphicBelongsToHandlerSQLBuilder<T, BasePolymorphicEntity<any>>
    )

export type ManyRelationHandlerSQLBuilder<
    T extends Entity = any,
    R extends Entity = any
> = (
        HasManyHandlerSQLBuilder<T, R> |
        HasManyThroughHandlerSQLBuilder<T, R> |
        BelongsToManyHandlerSQLBuilder<T, R> |
        PolymorphicHasManyHandlerSQLBuilder<T, R>
    )