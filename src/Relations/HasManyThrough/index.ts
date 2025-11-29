import ManyRelation from "../ManyRelation"

// SQL Builders
import { HasManyThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasManyThroughMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class HasManyThrough<
    T extends Entity,
    R extends Entity
> extends ManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyThroughMetadata,

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
    protected get sqlBuilder(): HasManyThroughHandlerSQLBuilder<T, R> {
        return new HasManyThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}