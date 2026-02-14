// SQL Builder
import {
    UpdateSQLBuilder,

    type UpdateAttributes
} from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import { MySQLOperation } from "../../Handlers"

// Types
import type { ResultSetHeader } from "mysql2"
import type {
    Constructor,
    EntityProps,
    EntityPropsKeys
} from "../../types"
import type { BaseEntity } from "../../Entities"

import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"
import type { conditionalMethods } from "../types"

/**
 * Build `UPDATE` query
 */
export default class UpdateQueryBuilder<T extends BaseEntity> {
    /** @internal */
    private _where?: ConditionalQueryBuilder<T>

    /** @internal */
    private attributes: UpdateAttributes<T> = {}

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    /** @internal */
    private get whereQB(): ConditionalQueryBuilder<T> {
        return this._where ??= new ConditionalQueryBuilder(
            this.target, this.alias
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Define attributes data to `SET` on operation
     * @param attributes - Attributes data
     * @returns {this} - `this`
     */
    public set(attributes: UpdateAttributes<T>): Omit<this, 'set'> {
        this.attributes = attributes
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
    * Execute defined operation in database
    * @returns - Update result
    */
    public exec(): Promise<ResultSetHeader> {
        return MySQLOperation.Update.exec({
            target: this.target,
            sqlBuilder: this.toSQLBuilder()
        }) as Promise<ResultSetHeader>
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return this.toSQLBuilder().SQL()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private toSQLBuilder(): UpdateSQLBuilder<T> {
        return new UpdateSQLBuilder(
            this.target,
            this.attributes,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )
    }
}