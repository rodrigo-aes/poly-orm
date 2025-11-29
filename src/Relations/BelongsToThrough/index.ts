import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler
} from "../../Handlers"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToThroughMetadata } from "../../Metadata"

/** BelongsToThrough relation handler */
export default class BelongsToThrough<
    T extends Entity,
    R extends Entity
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToThroughMetadata,

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
    protected get sqlBuilder(): BelongsToThroughHandlerSQLBuilder<T, R> {
        return new BelongsToThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}