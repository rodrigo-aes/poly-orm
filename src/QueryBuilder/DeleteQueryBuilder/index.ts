// SQL Builder
import { DeleteSQLBuilder } from "../../SQLBuilders"

// Query Builders
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Handlers
import {
    MySQLOperation,
    type DeleteResult
} from "../../Handlers"

// Types
import type { BaseEntity } from "../../Entities"
import type {
    Constructor,
    EntityProperties,
    EntityPropertiesKeys
} from "../../types"
import type {
    OperatorType,
    CompatibleOperators
} from "../OperatorQueryBuilder"
import type { ExistsQueryOptions } from "../ExistsQueryBuilder"

/**
 * Build a `DELETE` query
 */
export default class DeleteQueryBuilder<T extends BaseEntity> {
    /** @internal */
    private _where?: ConditionalQueryBuilder<T>

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    /** @internal */
    protected get whereQB(): ConditionalQueryBuilder<T> {
        return this._where ??= new ConditionalQueryBuilder(
            this.target, this.alias
        )
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
        this.whereQB.where(propertie, conditional, value)
        return this
    }

    // ------------------------------------------------------------------------
    /**
     * Add a exists conditional option to match
     * @param options - Exists options
     * @returns {this} - `this`
     */
    public whereExists(options: ExistsQueryOptions<T>): this {
        this.whereQB.whereExists(options)
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
    * @returns - Delete result
    */
    public exec(): Promise<DeleteResult> {
        return MySQLOperation.Delete.exec({
            target: this.target,
            sqlBuilder: new DeleteSQLBuilder(
                this.target,
                this._where?.toQueryOptions() ?? {},
                this.alias
            )
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to operation SQL string
     */
    public SQL(): string {
        return new DeleteSQLBuilder(
            this.target,
            this._where?.toQueryOptions() ?? {},
            this.alias
        )
            .SQL()
    }
}