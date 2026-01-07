import CreateQueryBuilder from "../CreateQueryBuilder"

// Handlers
import { MySQLOperation } from "../../../Handlers"

// Types
import type { BaseEntity } from "../../../Entities"
import type { CreateSQLBuilder, CreationAttributes } from "../../../SQLBuilders"

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

    public data(attributes: CreationAttributes<T>): Omit<
        this, 'fields' | 'values'
    > {
        this.sqlBuilder.setData(attributes)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Create result
    */
    public exec(): Promise<T> {
        this.sqlBuilder.bulk = false

        return MySQLOperation.Create.exec({
            target: this.target,
            sqlBuilder: this.sqlBuilder,
            toSource: false
        })
    }
}