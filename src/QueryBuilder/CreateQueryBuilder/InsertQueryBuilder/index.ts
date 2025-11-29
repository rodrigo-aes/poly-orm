import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../../Handlers"

// Types
import type { BaseEntity } from "../../../Entities"
import type { CreationAttributes } from "../../../SQLBuilders"

/**
 * Build `INSERT` query
 */
export default class InsertQueryBuilder<
    T extends BaseEntity
> extends CreateQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public values(...values: any[]): Omit<this, 'data'> {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public data(attributes: CreationAttributes<T>): (
        Omit<this, 'fields' | 'values'>
    ) {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Create result
    */
    public async exec(): Promise<T> {
        this.sqlBuilder.bulk = false

        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'entity'
        )
            .exec() as Promise<T>
    }
}