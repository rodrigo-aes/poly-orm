import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { HasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Constructor, Entity } from "../../types"
import type { HasOneMetadata } from "../../Metadata"

/** HasOne relation handler */
export default class HasOne<
    T extends Entity,
    R extends Entity
> extends HasOneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
    ) {
        super(metadata, target, related, instance)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): HasOneHandlerSQLBuilder<T, R> {
        return new HasOneHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}