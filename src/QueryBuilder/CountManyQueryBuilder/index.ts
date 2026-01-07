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
import type { CaseQueryHandler, conditionalMethods } from "../types"
import type { CaseMethods, CountMethods } from "./types"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build many `COUNT`s options
 */
export default class CountManyQueryBuilder<T extends Entity> {
    /** @internal */
    private options: CountQueryBuilder<T>[] = []

    /** @internal */
    private _count?: CountQueryBuilder<T>

    constructor(public target: Constructor<T>, public alias?: string) { }

    // Getters ================================================================
    // Protected --------------------------------------------------------------
    private get count(): CountQueryBuilder<T> {
        return this._count ??= new CountQueryBuilder(this.target, this.alias)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Select a entity property to count
     * @param name 
     * @returns 
     */
    public property(name: string): Omit<this, conditionalMethods | CaseMethods> {
        this.count.property(name)
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
        this.count.where(propertie, conditional, value)
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
        this.count.whereExists(options)
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
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.count.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a CASE clause conditional option
     * @param caseClause - Case query handler
     * @returns {this} - `this`
     */
    public case(caseClause: CaseQueryHandler<T>): Omit<
        this, conditionalMethods | CountMethods
    > {
        this.count.case(caseClause)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a AS alias/name to count result
     * @param name - Alias/Name
     */
    public as(name: string): this {
        this.count.as(name)
        this.options.push(this.count)

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
            this.options.map(count => {
                if (!count._as) PolyORMException.QueryBuilder.throw(
                    'MISSING_AS_ALIAS_ON_CLAUSE', 'count'
                )

                return [count._as, count.toQueryOptions()]
            })
        )
    }
}