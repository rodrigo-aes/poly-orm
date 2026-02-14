import { MetadataHandler } from "../../Metadata"

// SQL Builders
import {
    Op,
    AndSQLBuilder,
    type AndQueryOptions
} from "../../SQLBuilders"


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
    EntityProps,
    EntityPropsKeys
} from "../../types"


import type {
    CompatibleOperators,
    OperatorType
} from "../OperatorQueryBuilder"

/**
 * Build a `AND` conditional options
 */
export default class AndQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    /** @internal */
    private _options: AndQueryOptions<T> = {}

    /** @internal */
    private _exists?: ExistsQueryBuilder<T>

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
            ...this._exists?.toQueryOptions()
        }
    }

    // Privates ---------------------------------------------------------------
    private get exists(): ExistsQueryBuilder<T> {
        return this._exists ??= new ExistsQueryBuilder(this.target, this.alias)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Add a conditional where option to match
     * @param property - Entity propertie
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
        property: K | string,
        conditional: Cond,
        value?: Cond extends keyof OperatorType
            ? OperatorType[Cond]
            : never
    ): this {
        this._options[property] = (
            OperatorQueryBuilder.isOperator(conditional as string)
                ? {
                    [
                        OperatorQueryBuilder[conditional as (
                            CompatibleOperators<EntityProps<T>[K]>
                        )]
                    ]: value
                }
                : conditional
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
    public whereOr<
        K extends EntityPropsKeys<T>,
        Cond extends (
            EntityProps<T>[K] |
            [
                CompatibleOperators<EntityProps<T>[K]>,
                EntityProps<T>[K]
            ]
        )[]
    >(property: K, conditional: Cond): this {
        this._options[property] = {
            [Op.Or]: conditional.map(cond => Array.isArray(cond)
                ? { [OperatorQueryBuilder[cond[0]]]: cond[1] }
                : cond
            )
        } as any

        return this
    }

    // ------------------------------------------------------------------------

    public SQL(): string {
        return new AndSQLBuilder(this.target, this.options, this.alias).SQL()
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to `AndQueryOptions` object
     * @returns - A object with and options
     */
    public toQueryOptions(): AndQueryOptions<T> {
        return this.options
    }
}