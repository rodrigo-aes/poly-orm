import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToThroughMetadata } from "../../Metadata"
import type { BelongsToThrough } from "./types"

/** BelongsToThrough relation handler */
export class BelongsToThroughHandler<
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
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
    ) {
        super(metadata, target, related, instance)
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

// ----------------------------------------------------------------------------

export default function BelongsToThrough<
    T extends Entity,
    R extends Partial<Entity>
>(
    metadata: BelongsToThroughMetadata,
    target: T,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
    instance?: R | null
): BelongsToThrough<R> {
    return new BelongsToThroughHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        instance as (R & Entity) | null
    ) as unknown as BelongsToThrough<R>
}

export type {
    BelongsToThrough
}