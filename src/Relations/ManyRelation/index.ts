import { MetadataHandler } from "../../Metadata"
import { Collection, type CollectionJSON } from "../../Entities"

// Utils
import ProxyMerge from "../../utils/ProxyMerge"

// Handlers
import { MySQLOperation, type DeleteResult } from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type { Constructor, Entity, TargetMetadata } from "../../types"
import type { ManyRelationMetadatatype } from "../../Metadata"
import type {
    ManyRelationHandlerSQLBuilder,
    FindRelationQueryOptions,
    UpdateAttributes,
    ConditionalQueryOptions
} from "../../SQLBuilders"

/** Many relation handler */
export default abstract class ManyRelation<
    T extends Entity,
    R extends Entity,
    C extends Collection<R> = Collection<R>
> {
    /** @internal */
    declare public __$shouldUpdate?: boolean

    /** @internal */
    private _relatedMetadata?: TargetMetadata<R>

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
        return new ProxyMerge(this, this.instances) as any
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract get sqlBuilder(): ManyRelationHandlerSQLBuilder<T, R>

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedMetadata(): TargetMetadata<R> {
        return this._relatedMetadata ??= MetadataHandler.targetMetadata(
            this.related
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get relatedPrimary(): keyof R {
        return this.relatedMetadata.PK as keyof R
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Load related entities matched by conditional where options
     * @param where - conditional where options
     * @returns - 
     */
    public async load(options?: FindRelationQueryOptions<R>): Promise<this> {
        this.instances = await MySQLOperation.Relation.find(
            this.related,
            this.sqlBuilder.loadSQL(options)
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
    public async loadOne(options?: FindRelationQueryOptions<R>): Promise<
        R | null
    > {
        const instance = await MySQLOperation.Relation.findOne(
            this.related,
            this.sqlBuilder.loadOneSQL(options)
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
        return MySQLOperation.Relation.update(
            this.related,
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
    public delete(where?: ConditionalQueryOptions<R>): Promise<
        DeleteResult
    > {
        return MySQLOperation.Relation.delete(
            this.related,
            this.sqlBuilder.deleteSQL(where)
        )
    }

    // ------------------------------------------------------------------------

    public toJSON(): CollectionJSON<C> {
        return (this.instances as C).toJSON()
    }
}