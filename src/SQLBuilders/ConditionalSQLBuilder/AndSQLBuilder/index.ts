// SQL Builder
import ExistsSQLBuilder, { Exists } from '../ExistsSQLBuilder'

// Operators
import Operator, {
    type OperatorKey,
    type CompatibleOperators
} from "../Operator"

// Handlers
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../../types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"
import type {
    AndQueryOptions,
    PropAndQueryOptions,
    RelationAndQueryOptions
} from "./types"

export default class AndSQLBuilder<T extends Entity> {
    private metadata: TargetMetadata<T>
    private propOptions: PropAndQueryOptions<T>
    private relOptions?: RelationAndQueryOptions
    private existsSQLBuilder?: ExistsSQLBuilder<T>

    constructor(
        public target: Constructor<T>,
        public options: AndQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.propOptions = this.filterPropetiesOptions()
        this.relOptions = this.filterRelationOptions()
        this.existsSQLBuilder = this.buildExistsSQLBuilder()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                ...this.propertiesSQL(),
                ...this.relationsSQL(),
                ...this.existsSQL()
            ]
                .join(' AND ')
        )
    }

    // ------------------------------------------------------------------------

    public unions(): UnionSQLBuilder[] {
        return []
    }

    // Privates ---------------------------------------------------------------
    private propertiesSQL(): string[] {
        return Object
            .entries(this.propOptions)
            .map(([key, value]) => this.propertySQL(
                key as keyof PropAndQueryOptions<T>,
                value as any
            ))
    }

    // ------------------------------------------------------------------------

    private relationsSQL(): string[] {
        return this.relOptions
            ? Object
                .entries(this.relOptions)
                .map(([key, value]) => this.relationSQL(key, value))
            : []
    }

    // ------------------------------------------------------------------------

    private existsSQL(): string[] {
        return this.existsSQLBuilder ? [this.existsSQLBuilder?.SQL()] : []
    }

    // ------------------------------------------------------------------------

    private propertySQL<Key extends keyof PropAndQueryOptions<T>>(
        columnName: Key,
        value: PropAndQueryOptions<T>[Key]
    ): string {
        return this.isOperator(value)
            ? this.operatorSQL(columnName, value as CompatibleOperators<any>)
            : `${this.alias}.${columnName} = ${(
                PropertySQLHelper.valueSQL(value)
            )}`
    }

    // ------------------------------------------------------------------------

    private relationSQL(
        path: string,
        value: CompatibleOperators<any>
    ): string {
        const parts = path.split('.')
        const column = parts.pop()!
        const alias = `${this.alias}_${parts.join('_')}`

        return this.isOperator(value)
            ? this.operatorSQL(column, value, alias)
            : `${alias}.${column} = ${PropertySQLHelper.valueSQL(value)}`
    }

    // ------------------------------------------------------------------------

    private operatorSQL(
        column: string,
        operator: CompatibleOperators<any>,
        alias?: string
    ): string {
        const [key] = Object.getOwnPropertySymbols(operator) as (
            (keyof CompatibleOperators<any>)[]
        )

        return new Operator[key as OperatorKey](
            this.target,
            operator[key],
            column,
            alias ?? this.alias
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private isOperator(value: any) {
        return (
            value && typeof value === 'object' && Operator.hasOperator(value)
        )
    }

    // ------------------------------------------------------------------------

    private filterPropetiesOptions(): PropAndQueryOptions<T> {
        return Object.fromEntries(
            Object
                .entries(this.options)
                .filter(([key]) => this.metadata.columns.search(key))
        ) as PropAndQueryOptions<T>
    }

    // ------------------------------------------------------------------------

    private filterRelationOptions(): RelationAndQueryOptions {
        return Object.fromEntries(
            Object
                .entries(this.options)
                .filter(([key, value]) =>
                    (key.includes('.') || this.metadata.relations.search(key))
                    && value
                )
        )
    }

    // ------------------------------------------------------------------------

    private buildExistsSQLBuilder(): ExistsSQLBuilder<T> | undefined {
        if (this.options[Exists]) return new ExistsSQLBuilder(
            this.target,
            this.options[Exists],
            this.alias
        )
    }
}

export {
    type AndQueryOptions
}