import {
    MetadataHandler
} from "../../Metadata"

// SQL Builders
import {
    FindOneSQLBuilder,

    type FindOneQueryOptions as SQLBuilderOptions,
    type RelationsOptions,
    type GroupQueryOptions,

} from "../../SQLBuilders"

// Query Builders
import SelectQueryBuilder from "../SelectQueryBuilder"
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"
import JoinQueryBuilder from "../JoinQueryBuilder"
import GroupQueryBuilder from "../GroupQueryBuilder"

// Handlers
import {
    MySQL2QueryExecutionHandler,
    type FindOneResult,
    type ResultMapOption
} from "../../Handlers"

// Types
import type {
    Entity,
    Target,
    TargetMetadata,
    EntityTarget,
    EntityProperties,
    EntityPropertiesKeys,
    Constructor,
} from "../../types"

import type { FindOneQueryOptions } from "./types"

import type {
    SelectQueryHandler,
    CountQueryHandler,
    JoinQueryHandler
} from "../types"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

import type { SelectPropertiesOptions } from "../SelectQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"
import type { ConditionalQueryHandler } from "../types"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build FindOne query
 */
export default class FindOneQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<Constructor<T>>

    /** @internal */
    protected _options: FindOneQueryOptions<T> = {
        relations: {}
    }

    constructor(
        public target: Constructor<T>,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get selectOptions(): SelectQueryBuilder<T> {
        if (!this._options.select) this._options.select = (
            new SelectQueryBuilder(
                this.target,
                this.alias
            )
        )

        return this._options.select
    }

    // ------------------------------------------------------------------------

    protected get whereOptions(): ConditionalQueryBuilder<T> {
        if (!this._options.where) this._options.where = (
            new ConditionalQueryBuilder(
                this.target,
                this.alias
            )
        )

        return this._options.where
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `SELECT` options
     * @param selectClause - Select query handler
     * @returns {this} - `this`
     */
    public select(selectClause: SelectQueryHandler<T>): this {
        selectClause(this.selectOptions)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Define entity properties in `SELECT` options
     * @param properties - Properties names 
     * @returns {this} - `this`
     */
    public properties(...properties: SelectPropertiesOptions<T>[]): this {
        this.selectOptions.properties(...properties)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define to select a inline `COUNT` with entity properties
     * @param count - Entity property name to count or count query handler
     * @param as - Alias/Name to count result
     * @returns {this} - `this`
     */
    public count(
        countClause: CountQueryHandler<T> | string,
        as?: string
    ): this {
        this.selectOptions.count(countClause, as)
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
        this.verifyWhere()
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
    ): this {
        this.verifyWhere()

        this._options.where!.orWhere(
            propertie,
            conditional,
            value
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add required to current entity `INNER JOIN` to query options
     * @param relation - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
    public innerJoin<Related extends Entity>(
        relation: Constructor<Related> | string,
        joinClause?: JoinQueryHandler<Related>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this._options.relations!,
            joinClause,
            this.alias,
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add optional to current entity `LEFT JOIN` to query options
     * @param relation - Related entity target
     * @param joinClause - Join query handler
     * @returns {this} - `this`
     */
    public leftJoin<Related extends Entity>(
        relation: Constructor<Related> | string,
        joinClause?: JoinQueryHandler<Related>
    ): this {
        JoinQueryBuilder.build(
            this.metadata,
            relation,
            this._options.relations!,
            joinClause,
            this.alias,
            false
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add `GROUP BY` option
     * @param columns - Properties names
     * @returns {this} - `this`
     */
    public groupBy(...columns: GroupQueryOptions<T>): this {
        this._options.group = new GroupQueryBuilder(this.target, this.alias)
            .groupBy(...columns)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Excute operation in database and returns Find one result
     * @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance or `null`
     */
    public exec<MapTo extends ResultMapOption>(mapTo: MapTo): (
        Promise<FindOneResult<Constructor<T>, MapTo>>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            this.toSQLBuilder(),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `FindOneQueryOptions` object
    * @returns - A object with find one options
    */
    public toQueryOptions(): SQLBuilderOptions<T> {
        const { select, where, group } = this._options

        return {
            select: select?.toQueryOptions(),
            where: where?.toQueryOptions(),
            relations: this.relationsToOptions(),
            group: group?.toQueryOptions(),
        }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected toSQLBuilder(): FindOneSQLBuilder<Constructor<T>> {
        return new FindOneSQLBuilder(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected relationsToOptions(): (
        RelationsOptions<T> | undefined
    ) {
        if (!this._options.relations) return

        return Object.fromEntries(
            Object.entries(this._options.relations).map(
                ([name, value]) => [
                    name,
                    typeof value === 'boolean'
                        ? value
                        : (value as JoinQueryBuilder<any>).toQueryOptions()
                ]
            )
        ) as RelationsOptions<T>
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private verifyWhere(): void {
        if (!this._options.where) PolyORMException.QueryBuilder.throw(
            'EMPTY_AND_CLAUSE'
        )
    }
}

export {
    type FindOneQueryOptions
}