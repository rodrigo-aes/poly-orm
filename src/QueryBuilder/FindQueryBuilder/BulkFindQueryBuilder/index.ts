import FindQueryBuilder from "../FindQueryBuilder"

// Handlers
import {
    MySQLOperation,

    type CollectMapOptions,
    type FindResult
} from "../../../Handlers"

// SQL Builers
import {
    FindSQLBuilder,
    type FindQueryOptions as SQLBuilderOptions,
} from "../../../SQLBuilders"

// Query Builders
import OrderQueryBuilder, {
    type OrderQueryOptions
} from "../../OrderQueryBuilder"

// Types
import type { Entity } from "../../../types"
import type { FindQueryOptions } from "./types"

/**
 * Build Find query
 */
export default class BulkFindQueryBuilder<
    T extends Entity
> extends FindQueryBuilder<T> {
    /** @internal */
    protected override _options: FindQueryOptions<T> = {
        relations: {}
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `ORDER BY` options
     * @param order - Order options
     * @returns {this} - `this`
     */
    public orderBy(...options: OrderQueryOptions<T>): this {
        (this._options.order ??= new OrderQueryBuilder(
            this.target, this.alias
        ))
            .orderBy(...options)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `LIMIT` query option
     * @param limit - Integer limit
     * @returns {this} - `this`
     */
    public limit(limit: number): this {
        this._options.limit = limit
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define `OFFSET` query option
     * @param limit - Integer offset
     * @returns {this} - `this`
     */
    public offset(offset: number): this {
        this._options.offset = offset
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Excute operation in database and returns Find result
     * @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance or `null`
     */
    public override exec<M extends CollectMapOptions<T> = { mapTo: 'entity' }>(
        mapOptions?: M
    ): Promise<FindResult<T, M>> {
        return MySQLOperation.Find.exec({
            target: this.target,
            sqlBuilder: this.toSQLBuilder(),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `FindQueryOptions` object
    * @returns - A object with find options
    */
    public override toQueryOptions(): SQLBuilderOptions<T> {
        const { select, where, group, order, limit, offset } = this._options

        return {
            select: select?.toQueryOptions(),
            where: where?.toQueryOptions(),
            relations: this.relationsOptions(),
            group: group?.toQueryOptions(),
            order: order?.toQueryOptions(),
            limit,
            offset
        }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected override toSQLBuilder(): FindSQLBuilder<T> {
        return new FindSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }
}