// SQL Builders
import {
    CountSQLBuilder,

    type CountQueryOptions
} from "../../SQLBuilders"

// Query Builders
import CountQueryBuilder from "../CountQueryBuilder"

// Handlers
import { MySQLOperation } from "../../Handlers"

// Types
import type {
    Entity,
    Constructor,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"
import type { CaseQueryHandler, ConditionalQueryHandler } from "../types"
import type { WhereMethods, CaseMethods, CountMethods } from "./types"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build many `COUNT`s options
 */
export default class CountManyQueryBuilder<T extends Entity> {
    /** @internal */
    protected _options: CountQueryBuilder<T>[] = []

    /** @internal */
    protected _count?: CountQueryBuilder<T>

    constructor(public target: Constructor<T>, public alias?: string) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Select a entity property to count
     * @param name 
     * @returns 
     */
    public property(name: string): Omit<this, WhereMethods | CaseMethods> {
        this.handleCurrentCount()
        this._count!.property(name)

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
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.handleCurrentCount()
        this._count!.where(propertie, conditional, value)

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
        this.handleCurrentCount()
        this._count!.whereExists(options)

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
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.handleCurrentCount()
        this.orWhere(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a CASE clause conditional option
     * @param caseClause - Case query handler
     * @returns {this} - `this`
     */
    public case(caseClause: CaseQueryHandler<T>): (
        Omit<this, WhereMethods | CountMethods>
    ) {
        this.handleCurrentCount()
        this.case(caseClause)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a AS alias/name to count result
     * @param name - Alias/Name
     */
    public as(name: string): this {
        this.handleCurrentCount()
        this._count!.as(name)

        this._options.push(this._count!)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Execute defined operation in database
     * @returns - Count result
     */
    public exec<T extends any = any>(): Promise<T> {
        return MySQLOperation.Count.execMany(
            this.target,
            this.toSQLBuilder()
        ) as Promise<T>
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public toSQLBuilder(): CountSQLBuilder<T> {
        return CountSQLBuilder.countManyBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `CountQueryOptions` object
    * @returns - A object with count options
    */
    public toQueryOptions(): CountQueryOptions<T> {
        return Object.fromEntries(
            this._options.map(count => {
                if (!count._as) PolyORMException.QueryBuilder.throw(
                    'MISSING_AS_ALIAS_ON_CLAUSE', 'count'
                )

                return [count._as, count.toQueryOptions()]
            })
        )
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected handleCurrentCount(): void {
        this._count ??= new CountQueryBuilder(
            this.target,
            this.alias
        )
    }
}