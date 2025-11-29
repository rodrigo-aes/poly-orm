import { MetadataHandler } from "../../Metadata"

// SQL Builders
import { Op } from "../../SQLBuilders"

// Query Builders
import OperatorQueryBuilder from "../OperatorQueryBuilder"
import ExistsQueryBuilder, {
    type ExistsQueryOptions
} from "../ExistsQueryBuilder"

// Types
import type {
    Constructor,
    Entity,
    TargetMetadata,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"

import type { AndQueryOptions } from "../../SQLBuilders"

import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

/**
 * Build a `AND` conditional options
 */
export default class AndQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<Constructor<T>>

    /** @internal */
    private _options: AndQueryOptions<T> = {}

    /** @internal */
    private exists?: ExistsQueryBuilder<T>

    /** @internal */
    constructor(
        /** @internal */
        public target: Constructor<T>,

        /** @internal */
        public alias?: string
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    /** @internal */
    public get options(): AndQueryOptions<T> {
        return {
            ...this._options,
            ...this.exists?.toQueryOptions()
        }
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
        this._options[propertie] = (
            OperatorQueryBuilder.isOperator(conditional as string)
                ? {
                    [
                        OperatorQueryBuilder[conditional as (
                            CompatibleOperators<
                                EntityProperties<T>[K]
                            >
                        )]
                    ]: value
                }
                : conditional as any
        )

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
        this.exists = this.exists ?? new ExistsQueryBuilder(
            this.target,
            this.alias
        )

        this.exists.add(options)

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a AND required match or options
     * @param propertie - Entity propertie
     * @param conditional - Conditinal query options array to match one or many
     * @returns {this} - `this`
     */
    public andOr<
        K extends EntityPropertiesKeys<T>,
        Cond extends (
            EntityProperties<T>[K] |
            [
                CompatibleOperators<EntityProperties<T>[K]>,
                EntityProperties<T>[K]
            ]
        )[]
    >(
        propertie: K,
        conditional: Cond
    ): this {
        this._options[propertie] = {
            [Op.Or]: conditional.map(cond => Array.isArray(cond)
                ? { [OperatorQueryBuilder[cond[0]]]: cond[1] }
                : cond
            )
        } as any

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
     * Convert `this` to `AndQueryOptions` object
     * @returns - A object with and options
     */
    public toQueryOptions(): AndQueryOptions<T> {
        return this.options
    }
}