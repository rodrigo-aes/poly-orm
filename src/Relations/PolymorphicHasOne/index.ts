import HasOneRelation from "../OneRelation/HasOneRelation"

// SQL Builders
import { PolymorphicHasOneHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
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

export default function PolymorphicHasOne<
    T extends Entity,
    R extends Partial<Entity>
>(
    metadata: PolymorphicHasOneMetadata,
    target: T,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
    instance?: R | null
): PolymorphicHasOne<R> {
    return new PolymorphicHasOneHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        instance as R & Entity
    ) as unknown as PolymorphicHasOne<R>
}

export type {
    PolymorphicHasOne
}