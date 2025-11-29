import OneRelation from "../OneRelation"

// SQL Builders
import { HasOneThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasOneThroughMetadata } from "../../Metadata"

/** HasOneThrough relation handler */
export default class HasOneThrough<
    T extends Entity,
    R extends Entity
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneThroughMetadata,

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
    protected get sqlBuilder(): HasOneThroughHandlerSQLBuilder<T, R> {
        return new HasOneThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}