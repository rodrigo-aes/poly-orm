import ManyRelation from "../ManyRelation"
import { Collection } from "../../Entities"

// SQL Builders
import { HasManyThroughHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasManyThroughMetadata } from "../../Metadata"
import type { HasManyThrough } from "./types"

/** HasMany relation handler */
export class HasManyThroughHandler<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> extends ManyRelation<T, R, C> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyThroughMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        ),

        /** @internal */
        protected instances: C = new collection
    ) {
        super(metadata, target, related, collection, instances)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): HasManyThroughHandlerSQLBuilder<T, R> {
        return new HasManyThroughHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}

// ----------------------------------------------------------------------------

export default function HasManyThrough<
    T extends Entity,
    R extends Partial<Entity>,
    C extends Collection<any> = Collection<any>
>(
    metadata: HasManyThroughMetadata,
    target: T,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
): HasManyThrough<R, C> {
    return new HasManyThroughHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        collection,
        instances
    ) as unknown as HasManyThrough<R, C>
}

export type {
    HasManyThrough
}
