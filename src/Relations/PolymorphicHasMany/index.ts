import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import { PolymorphicHasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor, EntityTarget } from "../../types"
import type { PolymorphicHasManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class PolymorphicHasMany<
    T extends Entity,
    R extends Entity
> extends HasManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicHasManyMetadata,

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
    protected get sqlBuilder(): PolymorphicHasManyHandlerSQLBuilder<T, R> {
        return new PolymorphicHasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}