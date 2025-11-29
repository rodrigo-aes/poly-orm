import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToMetadata } from "../../Metadata"

/** BelongsTo relation handler */
export default class BelongsTo<
    T extends Entity,
    R extends Entity
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToMetadata,

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
    protected get sqlBuilder(): BelongsToHandlerSQLBuilder<T, R> {
        return new BelongsToHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}