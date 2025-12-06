import HasManyRelation from "../ManyRelation/HasManyRelation"
import { Collection } from "../../Entities"

// SQL Builders
import { HasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { HasManyMetadata } from "../../Metadata"
import type { HasMany } from "./types"

/** HasMany relation handler */
export class HasManyHandler<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> extends HasManyRelation<T, R, C> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyMetadata,

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
    protected get sqlBuilder(): HasManyHandlerSQLBuilder<T, R> {
        return new HasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}

// ----------------------------------------------------------------------------

export default function HasMany<
    T extends Entity,
    C extends Collection<T> = Collection<T>
>(
    metadata: HasManyMetadata,
    target: Entity,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<T> = metadata.relatedTarget as Constructor<T>,
): HasMany<T, C> {
    return new HasManyHandler(
        metadata,
        target,
        related,
        collection,
        instances
    ) as HasMany<T, C>
}

export type {
    HasMany
}