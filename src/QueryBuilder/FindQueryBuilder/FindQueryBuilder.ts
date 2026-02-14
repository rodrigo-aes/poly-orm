import {
    MetadataHandler
} from "../../Metadata"

// SQL Builders
import {
    type FindOneSQLBuilder,
    type FindSQLBuilder,

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
    MySQLOperation,
    type FindOneResult,
    type FindResult,
    type MapOptions,
    type CollectMapOptions
} from "../../Handlers"

// Types
import type {
    Entity,
    Target,
    TargetMetadata,
    EntityTarget,
    EntityProps,
    EntityPropsKeys,
    Constructor,
} from "../../types"

import type { FindOneQueryOptions } from "./FindOneQueryBuilder"

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
export default abstract class FindQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

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
    /** @internal */
    protected get selectQB(): SelectQueryBuilder<T> {
        return this._options.select ??= new SelectQueryBuilder(
            this.target,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    protected get whereQB(): ConditionalQueryBuilder<T> {
        return this._options.where ??= new ConditionalQueryBuilder(
            this.target,
            this.alias
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define `SELECT` options
     * @param handler - Select query handler
     * @returns {this} - `this`
     */
    public select(handler: SelectQueryHandler<T>): this {
        handler(this.selectQB)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Define entity properties in `SELECT` options
     * @param properties - Properties names 
     * @returns {this} - `this`
     */
    public properties(...properties: SelectPropertiesOptions<T>[]): this {
        this.selectQB.properties(...properties)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define to select a inline `COUNT` with entity properties
     * @param option - Entity property name to count or count query handler
     * @param as - Alias/Name to count result
     * @returns {this} - `this`
     */
    public count(
        option: CountQueryHandler<T> | string,
        as?: string
    ): this {
        this.selectQB.count(option, as)
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
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        this.whereQB.where(propertie, conditional, value)
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
        this.whereQB.whereExists(options)
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
        K extends EntityPropsKeys<T>,
        Cond extends (
            EntityProps<T>[K] |
            CompatibleOperators<EntityProps<T>[K]>
        )
    >(
        propertie: K | string,
        conditional: Cond,
        value?: typeof conditional extends keyof OperatorType
            ? OperatorType[typeof conditional]
            : never
    ): this {
        this.whereQB.orWhere(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add required to current entity `INNER JOIN` to query options
     * @param relation - Related entity target
     * @param handler - Join query handler
     * @returns {this} - `this`
     */
    public innerJoin<R extends Entity>(
        relation: Constructor<R> | string,
        handler?: JoinQueryHandler<R>
    ): this {
        JoinQueryBuilder.build<T, R>(
            this.metadata,
            relation,
            this._options.relations!,
            handler,
            this.alias,
        )

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add optional to current entity `LEFT JOIN` to query options
     * @param relation - Related entity target
     * @param handler - Join query handler
     * @returns {this} - `this`
     */
    public leftJoin<R extends Entity>(
        relation: Constructor<R> | string,
        handler?: JoinQueryHandler<R>
    ): this {
        JoinQueryBuilder.build<T, R>(
            this.metadata,
            relation,
            this._options.relations!,
            handler,
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
        this._options.group = new GroupQueryBuilder(
            this.target, this.alias
        )
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
    public abstract exec(
        mapOptions?: MapOptions | CollectMapOptions<T>
    ): Promise<any>

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
            relations: this.relationsOptions(),
            group: group?.toQueryOptions(),
        }
    }

    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected abstract toSQLBuilder(): FindOneSQLBuilder<T> | FindSQLBuilder<T>

    // ------------------------------------------------------------------------

    /** @internal */
    protected relationsOptions(): RelationsOptions<T> | undefined {
        if (this._options.relations) return Object.fromEntries(
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
}

export {
    type FindOneQueryOptions
}