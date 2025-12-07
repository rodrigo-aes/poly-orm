import { MetadataHandler } from "../../Metadata"
import { Collection } from "../../Entities"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type RelationQueryExecutionHandler,
    type DeleteResult
} from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    Constructor,
    Entity,
    TargetMetadata,
    EntityJSON
} from "../../types"
import type { ManyRelationMetadatatype } from "../../Metadata"
import type { ManyRelationHandlerSQLBuilder } from "../../SQLBuilders"
import type {
    ConditionalQueryOptions,
    UpdateAttributes
} from "../../SQLBuilders"

/** Many relation handler */
export default abstract class ManyRelation<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> {
    /** @internal */
    private _relatedMetadata?: TargetMetadata<Constructor<R>>

    /** @internal */
    constructor(
        /** @internal */
        protected metadata: ManyRelationMetadatatype,

        /** @internal */
        protected target: T,

        /** @internal */
        protected related: Constructor<R>,

        /** @internal */
        protected collection: Constructor<C> = Collection as (
            Constructor<C> & typeof Collection
        ),

        /** @internal */
        protected instances: R[] | C = new collection
    ) {
        if (!(instances instanceof collection)) instances = new collection(
            instances
        )

        return new Proxy(this, {
            get: (target, prop, receiver) => {
                const [t, value] = target.instances && prop in target.instances
                    ? [
                        target.instances,
                        Reflect.get(target.instances, prop, receiver)
                    ]
                    : [target, Reflect.get(target, prop, receiver)]

                return typeof value === "function"
                    ? value.bind(t)
                    : value
            },

            // ----------------------------------------------------------------

            set(target, prop, value, receiver) {
                return target.instances && prop in target.instances
                    ? Reflect.set(target.instances, prop, value, receiver)
                    : Reflect.set(target, prop, value, receiver)
            }
        })
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): ManyRelationHandlerSQLBuilder

    // ------------------------------------------------------------------------

    /** @internal */
    protected get queryExecutionHandler(): RelationQueryExecutionHandler<R> {
        return MySQL2QueryExecutionHandler.relation(this.related)
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedMetadata(): TargetMetadata<Constructor<R>> {
        return this._relatedMetadata ??= MetadataHandler.targetMetadata(
            this.related
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedPrimary(): keyof R {
        return this.relatedMetadata.columns.primary.name as keyof R
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Load related entities matched by conditional where options
     * @param where - conditional where options
     * @returns - 
     */
    public async load(where?: ConditionalQueryOptions<R>): Promise<this> {
        this.instances = await this.queryExecutionHandler.executeFind(
            this.sqlBuilder.loadSQL(where)
        ) as C // Implement this: (Parse entity collection) 

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Load the first related entity matched by conditional where options and
     * returns
     * @param where - Conditional where options
     * @returns - Related entity instance or `null`
     */
    public async loadOne(where?: ConditionalQueryOptions<R>): Promise<
        R | null
    > {
        const instance = await this.queryExecutionHandler.executeFindOne(
            this.sqlBuilder.loadOneSQL(where)
        )
        if (instance) this.instances.push(instance)

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Update all related entities registers matched by conditional where
     * options
     * @param attributes - Update attributes data 
     * @param where - Conditional where options
     * @returns - A result header with details of operation
     */
    public update(
        attributes: UpdateAttributes<R>,
        where?: ConditionalQueryOptions<R>
    ): Promise<ResultSetHeader> {
        return this.queryExecutionHandler.executeUpdate(
            this.sqlBuilder.updateSQL(attributes, where)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all related entities register matched by conditional where
     * options
     * @param where - Conditional where options
     * @returns - Delete result
     */
    public delete(where?: ConditionalQueryOptions<R>): Promise<DeleteResult> {
        return this.queryExecutionHandler.executeDelete(
            this.sqlBuilder.deleteSQL(where)
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): EntityJSON<R, R['hidden']>[] {
        return (this.instances as C).toJSON()
    }
}