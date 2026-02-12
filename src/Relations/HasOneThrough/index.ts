import OneRelation from "../OneRelation"

// SQL Builders
import { HasOneThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasOneThroughMetadata } from "../../Metadata"
import type { HasOneThrough } from "./types"

/** HasOneThrough relation handler */
export class HasOneThroughHandler<
    T extends Entity,
    R extends Entity
> extends OneRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasOneThroughMetadata,

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
    protected get sqlBuilder(): HasOneThroughHandlerSQLBuilder<T, R> {
        return new HasOneThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}

// ----------------------------------------------------------------------------

export default function HasOneThrough<
    T extends Entity,
    R extends Partial<Entity>
>(
    metadata: HasOneThroughMetadata,
    target: T,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
    instance?: R | null
): HasOneThrough<R> {
    return new HasOneThroughHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        instance as (R & Entity) | null
    ) as unknown as HasOneThrough<R>
}

export type {
    HasOneThrough
}