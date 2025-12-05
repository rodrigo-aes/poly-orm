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

export default function HasOneThrough<T extends Entity>(
    metadata: HasOneThroughMetadata,
    target: Entity,
    related: Constructor<T> = metadata.relatedTarget as Constructor<T>,
    instance?: T | null
): HasOneThrough<T> {
    return new HasOneThroughHandler(metadata, target, related, instance) as (
        HasOneThrough<T>
    )
}

export type {
    HasOneThrough
}