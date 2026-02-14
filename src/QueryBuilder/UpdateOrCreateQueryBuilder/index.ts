// SQL Builder
import {
    UpdateOrCreateSQLBuilder,
    type CreateAttributes
} from "../../SQLBuilders"

// Handlers
import { MySQLOperation } from "../../Handlers"

// Types
import type { Constructor, EntityPropsKeys } from "../../types"
import type { BaseEntity } from "../../Entities"

/**
 * Build a Update or Create query
 */
export default class UpdateOrCreateQueryBuilder<T extends BaseEntity> {
    /** @internal */
    private cols: EntityPropsKeys<T>[] = []
    private vals: any[] = []

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Entity properties names to insert on table
     * @param names - Properties names
     * @returns {this} - `this`
     */
    public properties(...names: EntityPropsKeys<T>[]): Omit<
        this, 'data'
    > {
        this.cols.push(...names)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Entity properties values to insert resgister on table 
     * @param values - Properties values
     * @returns {this} - `this`
     */
    public values(...values: any[]): Omit<this, 'data'> {
        this.vals.push(...values)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Entity properties and values object data to insert on table
     * @param attributes - Attributes data 
     * @returns {this} - `this`
     */
    public data(attributes: CreateAttributes<T>): Omit<
        this, 'fields' | 'values'
    > {
        this.cols.push(...Object.keys(attributes) as EntityPropsKeys<T>[])
        this.vals.push(...Object.values(attributes))
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Update or create result
    */
    public exec(): Promise<T> {
        return MySQLOperation.UpdateOrCreate.exec({
            target: this.target,
            sqlBuilder: this.toSQLBuilder()
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): CreateAttributes<T> {
        return Object.fromEntries(this.cols.map(
            (col, index) => [col, this.vals[index]]
        )) as any
    }

    // Privates ---------------------------------------------------------------
    private toSQLBuilder(): UpdateOrCreateSQLBuilder<T> {
        return new UpdateOrCreateSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}