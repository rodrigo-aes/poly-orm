import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import {
    MySQLOperation,

    type CreateCollectMapOptions,
    type CreateResult
} from "../../../Handlers"

// Types
import type { BaseEntity } from "../../../Entities"
import type { CreationAttributes } from "../../../SQLBuilders"

/**
 * Build a `BULK INSERT` query
 */
export default class BulkInsertQueryBuilder<
    T extends BaseEntity
> extends CreateQueryBuilder<T> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * An array of entity properties values array to insert many registers on 
     * table 
     * @param values - Array of properties values
     */
    public values(...values: any[][]): this {
        this.sqlBuilder.values(...values)
        return this
    }

    // ------------------------------------------------------------------------

    public data(attributes: CreationAttributes<T>[]): Omit<
        this, "fields" | "values"
    > {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Create many result
    */
    public async exec<M extends CreateCollectMapOptions<T>>(
        mapOptions?: M
    ): Promise<CreateResult<T, M>> {
        this.sqlBuilder.bulk = true

        return new MySQLOperation.Create<T, M>(
            this.target,
            this.sqlBuilder,
            mapOptions
        )
            .exec()
    }
}