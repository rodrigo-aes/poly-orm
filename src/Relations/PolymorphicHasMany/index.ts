import HasManyRelation from "../ManyRelation/HasManyRelation"
import { Collection } from "../../Entities"

// SQL Builders
import { PolymorphicHasManyHandlerSQLBuilder } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { PolymorphicHasManyMetadata } from "../../Metadata"
import type { PolymorphicHasMany } from "./types"

/** HasMany relation handler */
export class PolymorphicHasManyHandler<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> extends HasManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: PolymorphicHasManyMetadata,

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
    // protecteds -------------------------------------------------------------
    /** @internal */
    protected get sqlBuilder(): PolymorphicHasManyHandlerSQLBuilder<T, R> {
        return new PolymorphicHasManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }
}

// ----------------------------------------------------------------------------

export default function PolymorphicHasMany<
    T extends Entity,
    C extends Collection<T> = Collection<T>
>(
    metadata: PolymorphicHasManyMetadata,
    target: Entity,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<T> = metadata.relatedTarget as Constructor<T>,
): PolymorphicHasMany<T, C> {
    console.log(instances)

    return new PolymorphicHasManyHandler(
        metadata,
        target,
        related,
        collection,
        instances
    ) as PolymorphicHasMany<T, C>
}

export type {
    PolymorphicHasMany
}