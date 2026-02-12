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
    R extends Partial<Entity>,
    C extends Collection<any> = Collection<any>
>(
    metadata: PolymorphicHasManyMetadata,
    target: T,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
): PolymorphicHasMany<R, C> {
    return new PolymorphicHasManyHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        collection,
        instances
    ) as unknown as PolymorphicHasMany<R, C>
}

export type {
    PolymorphicHasMany
}