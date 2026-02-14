import { MetadataHandler, type EntityMetadata } from "../../Metadata"

// SQL Builders
import {
    CreateSQLBuilder,
    type CreateOneOrManyAttributes,
    type CreateAttributesKey
} from "../../SQLBuilders"

// Types
import type { BaseEntity } from "../../Entities"
import type { Constructor, EntityTarget } from "../../types"

export default abstract class CreateQueryBuilder<T extends BaseEntity> {
    /** @internal */
    protected metadata: EntityMetadata

    /** @internal */
    protected sqlBuilder: CreateSQLBuilder<T>

    constructor(
        public target: Constructor<T>,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.targetMetadata(
            this.target as EntityTarget
        )

        this.sqlBuilder = new CreateSQLBuilder(
            this.target,
            undefined,
            this.alias
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Entity properties names to insert on table
     * @param names - Properties names
     * @returns {this} - `this`
     */
    public properties(...names: CreateAttributesKey<T>[]): Omit<
        this, 'data'
    > {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Entity properties values to insert resgister on table 
     * @param values - Properties values
     */
    public abstract values(...values: any[]): Omit<this, 'data'>

    // ------------------------------------------------------------------------

    /**
     * Entity properties and values object data to insert on table
     * @param attributes - Attributes data 
     */
    public abstract data(attributes: CreateOneOrManyAttributes<T>): Omit<
        this, 'fields' | 'values'
    >

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `CreationAttributesOptions` object
    * @returns - A object with creations attributes options
    */
    public toQueryOptions(): CreateOneOrManyAttributes<T> {
        return this.sqlBuilder.mapAttributes()
    }
}