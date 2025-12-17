// SQL Builders
import {
    CountSQLBuilder,
    Case,

    type CountQueryOption,
    type CaseQueryOptions
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
    Target,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"
import type { CaseQueryHandler, ConditionalQueryHandler } from "../types"
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
    private _conditional?: (
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

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Select a entity property to count
     * @param name 
     * @returns 
     */
    public property(name: string): Omit<this, WhereMethods | CaseMethods> {
        this._conditional = name
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
        this.verifyWhere();
        (this._conditional as ConditionalQueryBuilder<T>).where(
            propertie,
            conditional,
            value
        )

        this.type = 'where'

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a exists conditional option to match
     * @param exists - A entity target or where query handler
     * @param conditional - Where query case another table entity included
     * @returns {this} - `this`
     */
    public whereExists(
        options: ExistsQueryOptions<T>
    ): this {
        (this._conditional as ConditionalQueryBuilder<T>).whereExists(options)
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
        this.verifyWhere();
        (this._conditional as ConditionalQueryBuilder<T>).orWhere(
            propertie,
            conditional,
            value
        )

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
        const handler = new CaseQueryBuilder(this.target, this.alias)

        caseClause(handler)
        this._conditional = handler
        this.type = 'case'

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a AS alias/name to count result
     * @param name - Alias/Name
     */
    public as(name: string): void {
        this._as = name
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
            case "prop": return this._conditional as string

            case "where": return (
                this._conditional as ConditionalQueryBuilder<T>
            )
                .toQueryOptions()

            case "case": return {
                [Case]: (this._conditional as CaseQueryBuilder<T>)
                    .toQueryOptions()
            }
        }
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private verifyWhere(): void {
        if (!this._conditional) this._conditional = (
            new ConditionalQueryBuilder(
                this.target,
                this.alias
            )
        )

        else if (!(this._conditional instanceof ConditionalQueryBuilder)) (
            PolyORMException.QueryBuilder.throw(
                'MIXED_IMCOMPATIBLE_CLAUSES_OPERATIONS',
                'conditional: "OR"',
                this._conditional instanceof CaseQueryBuilder
                    ? 'CASE'
                    : `property count (${this._conditional})`
            )
        )
    }
}