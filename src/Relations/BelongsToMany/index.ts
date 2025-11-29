import HasManyRelation from "../ManyRelation/HasManyRelation"

// SQL Builders
import {
    BelongsToManyHandlerSQLBuilder,
    type CreationAttributes
} from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { BelongsToManyMetadata } from "../../Metadata"

/** HasMany relation handler */
export default class BelongsToMany<
    T extends Entity,
    R extends Entity
> extends HasManyRelation<T, R> {
    /** @internal */
    constructor(
        /** @internal */
        protected metadata: BelongsToManyMetadata,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
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

        await this.queryExecutionHandler
            .executeVoidOperation(
                ...this.sqlBuilder.createForeingKeysSQL(entity)
            )

        return entity
    }

    // ------------------------------------------------------------------------

    public override async createMany(attributes: CreationAttributes<R>[]): (
        Promise<R[]>
    ) {
        const entities = await super.createMany(attributes)

        await this.queryExecutionHandler
            .executeVoidOperation(
                ...this.sqlBuilder.createForeingKeysSQL(entities)
            )

        return entities
    }

    // ------------------------------------------------------------------------

    /**
     * Attach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public attach(...relateds: (R | any)[]): Promise<void> {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.attachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    /**
     * Datach relations on join table to relateds passed
     * @param relateds - Array of related entity instance or primary key
     */
    public detach(...relateds: (R | any)[]): Promise<void> {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.detachSQL(relateds))
    }

    // ------------------------------------------------------------------------

    /**
     * Syncronize all attachs and detachs keeping only in relateds array
     * @param relateds - Array of related entity instance or primary key
     */
    public sync(...relateds: (R | any)[]): Promise<void> {
        return this.queryExecutionHandler
            .executeVoidOperation(this.sqlBuilder.syncSQL(relateds))
    }
}