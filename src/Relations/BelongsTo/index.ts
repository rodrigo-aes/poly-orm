import OneRelation from "../OneRelation"

// SQL Builders
import { BelongsToHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToMetadata } from "../../Metadata"
import type { BelongsTo } from "./types"

/** BelongsTo relation handler */
export class BelongsToHandler<
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
        protected related: Constructor<R>,

        /** @internal */
        protected instance?: R | null
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

// ----------------------------------------------------------------------------

export default function BelongsTo<T extends Entity>(
    metadata: BelongsToMetadata,
    target: Entity,
    related: Constructor<T> = metadata.relatedTarget as Constructor<T>,
    instance?: T | null
): BelongsTo<T> {
    return new BelongsToHandler(metadata, target, related, instance) as (
        BelongsTo<T>
    )
}

export type {
    BelongsTo
}
