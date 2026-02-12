import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { HasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Constructor, Entity } from "../../types"
import type { HasOneMetadata } from "../../Metadata"
import type { HasOne } from "./types"

/** HasOne relation handler */
export class HasOneHandler<
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

// ----------------------------------------------------------------------------

export default function HasOne<T extends Entity, R extends Partial<Entity>>(
    metadata: HasOneMetadata,
    target: T,
    instance?: R | null,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>
): HasOne<R> {
    return new HasOneHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        instance as (R & Entity) | null
    ) as unknown as HasOne<R>
}

export type {
    HasOne
}