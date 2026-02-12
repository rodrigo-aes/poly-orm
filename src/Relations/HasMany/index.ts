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
    R extends Partial<Entity>,
    C extends Collection<any> = Collection<any>
> extends HasManyRelation<T, R & Entity, C> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: HasManyMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R & Entity>,

        /** @internal */
        protected collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        ),

        /** @internal */
        protected instances: C = new collection
    ) {
        super(metadata, target, related as Constructor<R & Entity>, collection, instances)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): HasManyHandlerSQLBuilder<T, R & Entity> {
        return new HasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related as Constructor<R & Entity>
        )
    }
}

// ----------------------------------------------------------------------------

export default function HasMany<
    T extends Entity,
    R extends Partial<Entity>,
    C extends Collection<any> = Collection<any>
>(
    metadata: HasManyMetadata,
    target: T,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
): HasMany<R, C> {
    return new HasManyHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        collection,
        instances
    ) as unknown as HasMany<R, C>
}

export type {
    HasMany
}