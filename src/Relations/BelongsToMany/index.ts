import HasManyRelation from "../ManyRelation/HasManyRelation"
import { Collection } from "../../Entities"

import { MySQLOperation } from "../../Handlers"

// SQL Builders
import {
    BelongsToManyHandlerSQLBuilder,
    type CreationAttributes
} from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToManyMetadata } from "../../Metadata"
import type { BelongsToMany } from "./types"

/** HasMany relation handler */
export class BelongsToManyHandler<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> extends HasManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToManyMetadata,

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
    protected get sqlBuilder(): (
        BelongsToManyHandlerSQLBuilder<T, R>
    ) {
        return new BelongsToManyHandlerSQLBuilder(
            this.metadata,
            this.target,
            this.related
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override async create(attributes: CreationAttributes<R>): Promise<R> {
        const entity = await super.create(attributes)

        await MySQLOperation.Relation.voidOperation(
            this.related,
            this.sqlBuilder.createForeingKeysSQL(entity)
        )

        return entity
    }

    // ------------------------------------------------------------------------

    public override async createMany(
        attributes: CreationAttributes<R>[]
    ): Promise<R[]> {
        const entities = await super.createMany(attributes)

        await MySQLOperation.Relation.voidOperation(
            this.related,
            this.sqlBuilder.createForeingKeysSQL(entities)
        )

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Attach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public attach(...relateds: (R | any)[]): Promise<void> {
        return MySQLOperation.Relation.voidOperation(
            this.related,
            this.sqlBuilder.attachSQL(relateds)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Datach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public detach(...relateds: (R | any)[]): Promise<void> {
        return MySQLOperation.Relation.voidOperation(
            this.related,
            this.sqlBuilder.detachSQL(relateds)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Syncronize all attachs and detachs keeping only in relateds array
     * @param relateds - Array of related entity instance or primary key
     */
    public sync(...relateds: (R | any)[]): Promise<void> {
        return MySQLOperation.Relation.voidOperation(
            this.related,
            this.sqlBuilder.syncSQL(relateds)
        )
    }
}

// ----------------------------------------------------------------------------

export default function BelongsToMany<
    T extends Entity,
    R extends Partial<Entity>,
    C extends Collection<any> = Collection<any>
>(
    metadata: BelongsToManyMetadata,
    target: T,
    collection: Constructor<C> = Collection as (
        Constructor<C> & typeof Collection
    ),
    instances: C = new collection,
    related: Constructor<R> = metadata.relatedTarget as Constructor<R & Entity>,
): BelongsToMany<R, C> {
    return new BelongsToManyHandler(
        metadata,
        target,
        related as Constructor<R & Entity>,
        collection,
        instances
    ) as unknown as BelongsToMany<R, C>
}

export type {
    BelongsToMany
}