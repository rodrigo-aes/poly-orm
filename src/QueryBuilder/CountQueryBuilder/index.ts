// SQL Builders
import {
    CountSQLBuilder,
    Case,

    type CountQueryOption
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"
import CaseQueryBuilder from "../CaseQueryBuilder"

// Handlers
import { MySQLOperation } from "../../Handlers"

// Types
import type {
    Entity,
    Constructor,
    EntityProps,
    EntityPropsKeys
} from "../../types"
import type { CaseQueryHandler, CountQueryHandler } from "../types"
import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"
import { ExistsQueryOptions } from "../ExistsQueryBuilder"

// Exceptions
import PolyORMException from "../../Errors"

type WhereMethods = 'where' | 'whereExists' | 'and' | 'andExists' | 'orWhere'
type CaseMethods = 'case'
type CountMethods = 'count'

/**
 * Build a `COUNT` option
 */
export default class CountQueryBuilder<T extends Entity> {
    /** @internal */
    public _as?: string

    /** @internal */
    private conditional?: (
        string |
        ConditionalQueryBuilder<T> |
        CaseQueryBuilder<T>
    )

    /** @internal */
    public type!: 'prop' | 'where' | 'case'

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    /** @internal */
    private get conditionalQB(): ConditionalQueryBuilder<T> {
        this.type = 'where'
        return ((this.conditional ??= (
            new ConditionalQueryBuilder(this.target, this.alias)
        )) instanceof ConditionalQueryBuilder)
            ? this.conditional
            : (() => {
                throw PolyORMException.QueryBuilder.instantiate(
                    'MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS',
                    'conditional: "OR"',
                    this.conditional instanceof CaseQueryBuilder
                        ? 'CASE'
                        : `property count (${this.conditional})`
                )
            })()
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private get caseQB(): CaseQueryBuilder<T> {
        this.type = 'case'
        return ((this.conditional ??= (
            new CaseQueryBuilder(this.target, this.alias)
        )) instanceof CaseQueryBuilder)
            ? this.conditional
            : (() => {
                throw PolyORMException.QueryBuilder.instantiate(
                    'MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS',
                    'conditional: "OR"',
                    this.conditional instanceof ConditionalQueryBuilder
                        ? 'WHERE'
                        : `property count (${this.conditional})`
                )
            })()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Select a entity property to count
     * @param name 
     * @returns 
     */
    public property(name: string): Omit<this, WhereMethods | CaseMethods> {
        this.conditional = name
        this.type = 'prop'

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
        K extends EntityPropsKeys<T>,
        Cond extends (
            EntityProps<T>[K] |
            CompatibleOperators<EntityProps<T>[K]>
        )
    >(
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.conditionalQB.where(propertie, conditional, value)
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
        this.conditionalQB.whereExists(options)
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
        K extends EntityPropsKeys<T>,
        Cond extends (
            EntityProps<T>[K] |
            CompatibleOperators<EntityProps<T>[K]>
        )
    >(
        propertie: K,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): Omit<this, CaseMethods | CountMethods> {
        this.conditionalQB.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a CASE clause conditional option
     * @param handler - Case query handler
     * @returns {this} - `this`
     */
    public case(handler: CaseQueryHandler<T>): Omit<
        this, WhereMethods | CountMethods
    > {
        this.caseQB.handle(handler)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a AS alias/name to count result
     * @param name - Alias/Name
     */
    public as(name: string): Omit<
        this, WhereMethods | CaseMethods | CountMethods | 'as'
    > {
        this._as = name
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Execute defined operation in database
     * @returns - Count result
     */
    public exec(): Promise<number> {
        return MySQLOperation.Count.execSingle(
            this.target,
            this.toSQLBuilder()
        )
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
        return CountSQLBuilder.countBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `CountQueryOption` object
    * @returns - A object with count option
    */
    public toQueryOptions(): CountQueryOption<T> | string {
        switch (this.type) {
            case "prop": return this.conditional as string

            // ----------------------------------------------------------------

            case "where": return (this.conditional as (
                ConditionalQueryBuilder<T>
            ))
                .toQueryOptions()

            // ----------------------------------------------------------------

            case "case": return {
                [Case]: (this.conditional as CaseQueryBuilder<T>)
                    .toQueryOptions()
            }
        }
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public handle(handler: CountQueryHandler<T>): this {
        handler(this)
        return this
    }
}