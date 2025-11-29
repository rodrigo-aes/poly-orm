import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { PolymorphicHasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor, Target } from "../../types"
import type { PolymorphicHasOneMetadata } from "../../Metadata"

export default class PolymorphicHasOne<
    T extends Entity,
    R extends Entity
> extends HasOneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicHasOneMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): PolymorphicHasOneHandlerSQLBuilder<T, R> {
        return new PolymorphicHasOneHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}