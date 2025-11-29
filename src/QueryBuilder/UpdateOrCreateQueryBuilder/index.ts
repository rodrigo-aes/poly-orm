// SQL Builder
import {
    UpdateOrCreateSQLBuilder,

    type UpdateOrCreateAttibutes,
} from "../../SQLBuilders"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type {
    Constructor,
    EntityPropertiesKeys
} from "../../types"
import type { BaseEntity } from "../../Entities"

/**
 * Build a Update or Create query
 */
export default class UpdateOrCreateQueryBuilder<T extends BaseEntity> {
    /**
     * @internal
     */
    private sqlBuilder: UpdateOrCreateSQLBuilder<Constructor<T>>

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) {
        this.sqlBuilder = new UpdateOrCreateSQLBuilder(
            this.target,
            {} as any,
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
    public properties(...names: EntityPropertiesKeys<T>[]): (
        Omit<this, 'data'>
    ) {
        this.sqlBuilder.fields(...names)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Entity properties values to insert resgister on table 
     * @param values - Properties values
     * @returns {this} - `this`
     */
    public values(...values: any[]): Omit<this, 'data'> {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Entity properties and values object data to insert on table
     * @param attributes - Attributes data 
     * @returns {this} - `this`
     */
    public data(attributes: UpdateOrCreateAttibutes<T>): (
        Omit<this, 'fields' | 'values'>
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Update or create result
    */
    public exec(): Promise<T> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'entity'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }
}