import { MetadataHandler } from "../../Metadata"

// Query Handlers
import AndQueryBuilder from "../AndQueryBuilder"

// Types
import type {
    Constructor,
    Entity,
    TargetMetadata,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"

import type { ConditionalQueryOptions } from "../../SQLBuilders"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

// Exceptions
import PolyORMException from "../../Errors"

/**
 * Build a `WHERE/ON` conditional options 
 */
export default class ConditionalQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private _and!: AndQueryBuilder<T>

    /** @internal */
    private _or?: AndQueryBuilder<T>[]

    /** @internal */
    constructor(
        /** @internal */
        public target: Constructor<T>,

        /** @internal */
        public alias?: string,
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.addAnd()
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
        this._and.where(propertie, conditional, value)
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
        this._and.whereExists(options)
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
        this.throwIfEmptyAnd()
        this._or = this._or ?? []
        this._or.push(this._and)
        this._or.push(this.addAnd())

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
        this.or()
        this._and.where(propertie, conditional, value)

        return this
    }

    // ------------------------------------------------------------------------

    /**
    * Convert `this` to `ConditionalQueryOptions` object
    * @returns - A object with conditional options
    */
    public toQueryOptions(): ConditionalQueryOptions<T> {
        return this._or?.map(opt => opt.toQueryOptions())
            ?? this._and.toQueryOptions()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private addAnd(): AndQueryBuilder<T> {
        return this._and = new AndQueryBuilder(
            this.target,
            this.alias
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private throwIfEmptyAnd(): void {
        if (Object.keys(this._and.toQueryOptions()).length === 0) (
            PolyORMException.QueryBuilder.throw('EMPTY_AND_CLAUSE')
        )
    }
}