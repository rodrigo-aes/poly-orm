import { MetadataHandler } from "../../Metadata"

// SQL Builders
import { ConditionalSQLBuilder } from "../../SQLBuilders"

// Query Builders
import AndQueryBuilder from "../AndQueryBuilder"

// Utils
import ProxyMerge from "../../utils/ProxyMerge"

// Types
import type {
    Constructor,
    Entity,
    TargetMetadata,
    EntityProps,
    EntityPropsKeys
} from "../../types"

import type { ConditionalQueryOptions } from "../../SQLBuilders"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"
import type { ConditionalQueryHandler } from "../types"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build a `WHERE/ON` conditional options 
 */
export default class ConditionalQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private and!: AndQueryBuilder<T>

    /** @internal */
    private or?: AndQueryBuilder<T>[]

    constructor(
        public target: Constructor<T>,
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.newAndQB()
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
        this.and.where(propertie, conditional, value)
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
        this.and.whereExists(options)
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
        this.newOrClause().where(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------

    public SQL(clause?: 'WHERE' | 'ON'): string {
        return clause ? `${clause} ` : '' + ConditionalSQLBuilder.conditional(
            this.target,
            this.toQueryOptions(),
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `ConditionalQueryOptions` object
    * @returns - A object with conditional options
    */
    public toQueryOptions(): ConditionalQueryOptions<T> {
        return this.or?.map(opt => opt.toQueryOptions()) ?? (
            this.and.toQueryOptions()
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    public handle(handler: ConditionalQueryHandler<T>): this {
        handler(this)
        return this
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private newAndQB(): AndQueryBuilder<T> {
        return this.and = new AndQueryBuilder(
            this.target,
            this.alias
        )
    }

    // ------------------------------------------------------------------------
    private newOrClause(): AndQueryBuilder<T> {
        this.throwIfEmptyAnd();
        (this.or ??= []).push(this.and, this.newAndQB())
        return this.and
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private throwIfEmptyAnd(): void {
        if (Object.keys(this.and.toQueryOptions()).length === 0) (
            PolyORMException.QueryBuilder.throw('EMPTY_AND_CLAUSE')
        )
    }
}