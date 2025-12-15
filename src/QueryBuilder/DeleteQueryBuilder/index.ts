// SQL Builder
import { DeleteSQLBuilder } from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import {
    MySQLOperation,
    type DeleteResult
} from "../../Handlers"

// Types
import type { BaseEntity } from "../../Entities"
import type {
    Constructor,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"
import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"

/**
 * Build a `DELETE` query
 */
export default class DeleteQueryBuilder<T extends BaseEntity> {
    /** @internal */
    private _sqlBuilder?: DeleteSQLBuilder<T>

    /** @internal */
    private _where?: ConditionalQueryBuilder<T>

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get whereOptions(): ConditionalQueryBuilder<T> {
        if (!this._where) this._where = new ConditionalQueryBuilder(
            this.target,
            this.alias
        )

        return this._where
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private get sqlBuilder(): DeleteSQLBuilder<T> {
        return this._sqlBuilder ?? this.instantiateSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
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
     * @param options - Exists options
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
     * Initialize and define a new OR where condtional options
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
    * @returns - Delete result
    */
    public exec(): Promise<DeleteResult> {
        return new MySQLOperation.Delete(
            this.target,
            this.sqlBuilder
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

    // Privates ---------------------------------------------------------------
    /** @internal */
    private instantiateSQLBuilder(): DeleteSQLBuilder<T> {
        this._sqlBuilder = new DeleteSQLBuilder(
            this.target,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )

        return this._sqlBuilder
    }
}