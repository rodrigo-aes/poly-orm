// SQL Builder
import {
    UpdateSQLBuilder,

    type UpdateAttributes
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import { MySQL2QueryExecutionHandler } from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    Constructor,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"
import type { BaseEntity } from "../../Entities"

import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"
import type { ConditionalQueryHandler } from "../types"

/**
 * Build `UPDATE` query
 */
export default class UpdateQueryBuilder<T extends BaseEntity> {
    /** @internal */
    private _where?: ConditionalQueryBuilder<T>

    /** @internal */
    private attributes: UpdateAttributes<T> = {}

    /** @internal */
    private _sqlBuilder?: UpdateSQLBuilder<Constructor<T>>

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get whereOptions(): ConditionalQueryBuilder<T> {
        return this._where = this._where ?? new ConditionalQueryBuilder(
            this.target,
            this.alias
        )
    }

    // privates ---------------------------------------------------------------
    /** @internal */
    private get sqlBuilder(): UpdateSQLBuilder<Constructor<T>> {
        return this._sqlBuilder ?? this.instantiateSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define attributes data to `SET` on operation
     * @param attributes - Attributes data
     * @returns {this} - `this`
     */
    public set(attributes: UpdateAttributes<T>): this {
        this.attributes = { ...this.attributes, ...attributes }
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a conditional where option to match
     * @param propertie - Entity propertie
     * @param conditional - Value or operator
     * @param value - Value case operator included
     * @returns {this} - `this`
     */
    public where<
        K extends EntityPropertiesKeys<T>,
        Cond extends (
            EntityProperties<T>[K] |
            CompatibleOperators<EntityProperties<T>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        this.whereOptions.where(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a exists conditional option to match
     * @param exists - A entity target or where query handler
     * @param conditional - Where query case another table entity included
     * @returns {this} - `this`
     */
    public whereExists(options: ExistsQueryOptions<T>): this {
        this.whereOptions.whereExists(options)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a and where conditional option
     */
    public and = this.where

    // ------------------------------------------------------------------------

    /**
     * Add a and exists contional option
     */
    public andExists = this.whereExists

    // ------------------------------------------------------------------------

    /**
     * Initialize a new OR where condtional options
     * @returns 
     */
    public or(): this {
        this.whereOptions.or()
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * * Initialize and define a new OR where condtional options
     * @param propertie - Entity propertie
     * @param conditional - Value or operator
     * @param value - Value case operator included
     * @returns {this} - `this`
     */
    public orWhere<
        K extends EntityPropertiesKeys<T>,
        Cond extends (
            EntityProperties<T>[K] |
            CompatibleOperators<EntityProperties<T>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ) {
        this.whereOptions.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Execute defined operation in database
    * @returns - Update result
    */
    public exec(): Promise<ResultSetHeader> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.sqlBuilder,
            'raw'
        )
            .exec() as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.sqlBuilder.SQL()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private instantiateSQLBuilder(): UpdateSQLBuilder<Constructor<T>> {
        this._sqlBuilder = new UpdateSQLBuilder(
            this.target,
            this.attributes,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )

        return this._sqlBuilder
    }
}