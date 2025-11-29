import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import { HasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class HasMany<
    T extends Entity,
    R extends Entity
> extends HasManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): HasManyHandlerSQLBuilder<T, R> {
        return new HasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}