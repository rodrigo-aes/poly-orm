import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { PolymorphicHasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor, Target } from "../../types"
import type { PolymorphicHasOneMetadata } from "../../Metadata"
import type { PolymorphicHasOne } from "./types"

export class PolymorphicHasOneHandler<
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
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
    ) {
        super(metadata, target, related, instance)
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

// ----------------------------------------------------------------------------

export default function PolymorphicHasOne<T extends Entity>(
    metadata: PolymorphicHasOneMetadata,
    target: Entity,
    related: Constructor<T> = metadata.relatedTarget as Constructor<T>,
    instance?: T | null
): PolymorphicHasOne<T> {
    return new PolymorphicHasOneHandler(
        metadata,
        target,
        related,
        instance
    ) as PolymorphicHasOne<T>
}

export type {
    PolymorphicHasOne
}