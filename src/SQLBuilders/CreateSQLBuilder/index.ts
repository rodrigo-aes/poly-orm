// Dependencies
import { v4 as UUIDV4 } from "uuid"

import { EntityMetadata } from "../../Metadata"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Symbols
import { Literal } from "../Symbols"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../types"
import type {
    CreationAttributesOptions,
    CreationAttributes,
    CreationAttributesKey,
    AttributesNames,
} from "./types"

export default class CreateSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _bulk: boolean
    private _names?: AttributesNames<InstanceType<T>>
    private _values?: any[]

    private _patternNames?: CreationAttributesKey<InstanceType<T>>[]
    private _mapped?: CreationAttributesOptions<InstanceType<T>>

    constructor(
        public target: T,
        public attributes?: CreationAttributesOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase(),
        public absolute: boolean = true
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this._bulk = Array.isArray(this.attributes)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): CreationAttributesKey<InstanceType<T>>[] {
        return Array.from(this._names ??= this.handleNames())
    }

    // ------------------------------------------------------------------------

    public get columnsValues(): any[] {
        return this._values ??= this.handleValues()
    }

    // Setters ================================================================
    public set bulk(bulk: boolean) {
        this._bulk = bulk
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            `INSERT INTO ${this.metadata.tableName} (${(
                this.columnsSQL()
            )}) VALUES ${this.valuesSQL()}`
        )
    }

    // ------------------------------------------------------------------------

    public fields(...names: CreationAttributesKey<InstanceType<T>>[]): this {
        this._names = new Set(names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._values = values
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: CreationAttributesOptions<InstanceType<T>>): (
        this
    ) {
        this.attributes = attributes
        this._names = undefined
        this._values = undefined

        return this
    }

    // ------------------------------------------------------------------------

    public mapAttributes(): CreationAttributesOptions<InstanceType<T>> {
        return this._mapped ??= (
            this.bulk
                ? this.columnsValues
                    ?.map(values => this.mapAttributeOption(values)) ?? []

                : this.mapAttributeOption(this.columnsValues as any[])
        )
    }

    // Privates ---------------------------------------------------------------
    private columnsSQL(): string {
        return this.columnsNames.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return Array.isArray(this.columnsValues[0])
            ? this.columnsValues
                .map(values => this.valueSetSQL(values))
                .join(', ')

            : this.valueSetSQL(this.columnsValues)
    }

    // ------------------------------------------------------------------------

    private valueSetSQL(values: any[]): string {
        return `(${values.map(v => PropertySQLHelper.valueSQL(v)).join(', ')})`
    }

    // ------------------------------------------------------------------------

    private handleNames(): AttributesNames<InstanceType<T>> {
        return new Set(this._bulk
            ? this.bulkPropertyNames()
            : this.propertyNames()
        ) as AttributesNames<InstanceType<T>>
    }

    // ------------------------------------------------------------------------

    private bulkPropertyNames(): CreationAttributesKey<InstanceType<T>>[] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[])
            .flatMap(att => this.propertyNames(att)) as (
                CreationAttributesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private propertyNames(attributes?: CreationAttributes<InstanceType<T>>): (
        CreationAttributesKey<InstanceType<T>>[]
    ) {
        return this.patternPropsNames().concat(Object
            .keys(attributes ?? this.attributes!)
            .filter(key => this.metadata.columns.search(key)) as (
                CreationAttributesKey<InstanceType<T>>[]
            )
        )
    }

    // ------------------------------------------------------------------------

    private patternPropsNames(): CreationAttributesKey<InstanceType<T>>[] {
        return this._patternNames ??= this.PKPatternName()
    }

    // ------------------------------------------------------------------------

    private PKPatternName(): CreationAttributesKey<InstanceType<T>>[] {
        switch (this.metadata.columns.primary.pattern) {
            case 'polymorphic-id': return [
                this.metadata.columns.primary.name as (
                    CreationAttributesKey<InstanceType<T>>
                )
            ]

            default: return []
        }
    }

    // ------------------------------------------------------------------------

    private handleValues(): any[] | any[][] {
        return this._bulk
            ? this.bulkCreateValues()
            : this.createValues()
    }

    // ------------------------------------------------------------------------

    private bulkCreateValues(): any[][] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[])
            .map(att => this.createValues(att))
    }

    // ------------------------------------------------------------------------

    private createValues(
        attributes: CreationAttributes<InstanceType<T>> = this.attributes as (
            CreationAttributes<InstanceType<T>>
        )
    ): any[] {
        return this.columnsNames.map(column =>
            attributes[column]
            ?? this.patternCreateValue(column)
            ?? this.metadata.columns.search(column as string)?.defaultValue
            ?? null
        )
    }


    // ------------------------------------------------------------------------

    private patternCreateValue(
        column: CreationAttributesKey<InstanceType<T>>
    ): any {
        switch (this.metadata.columns.findOrThrow(column).pattern) {
            case 'polymorphic-id': return `${this.target.name}_${UUIDV4()}`

            default: return undefined
        }
    }

    // ------------------------------------------------------------------------

    private mapAttributeOption(values: any[]): (
        CreationAttributes<InstanceType<T>>
    ) {
        return Object.fromEntries(values.map((value, index) => [
            this.columnsNames[index], value
        ])) as CreationAttributes<InstanceType<T>>
    }
}

export {
    type CreationAttributesOptions,
    type CreationAttributes,
    type CreationAttributesKey as CreationAttibutesKey
}