import FindQueryBuilder from "../FindQueryBuilder"

// SQL Builders
import { FindOneSQLBuilder } from "../../../SQLBuilders"

// Handlers
import {
    MySQLOperation,
    type FindOneResult,
    type MapOptions
} from "../../../Handlers"

// Types
import type { Entity } from "../../../types"
import type { FindOneQueryOptions } from "./types"

/**
 * Build FindOne query
 */
export default class FindOneQueryBuilder<
    T extends Entity
> extends FindQueryBuilder<T> {
    /**
     * Excute operation in database and returns Find one result
     * @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance or `null`
     */
    public exec<M extends MapOptions>(mapOptions?: M): Promise<
        FindOneResult<T, M>
    > {
        return MySQLOperation.FindOne.exec({
            target: this.target,
            sqlBuilder: this.toSQLBuilder(),
            mapOptions
        })
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected toSQLBuilder(): FindOneSQLBuilder<T> {
        return new FindOneSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}

export {
    type FindOneQueryOptions
}