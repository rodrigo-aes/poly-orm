import { EntityMetadata } from "../../Metadata"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { EntityTarget } from "../../types"
import type {
    CreationAttributesOptions,
    CreationAttributes,
    CreationAttibutesKey,
    AttributesNames,
} from "./types"

export default class CreateSQLBuilder<T extends EntityTarget> {
    protected metadata: EntityMetadata

    private _bulk: boolean
    private _propertiesNames?: AttributesNames<InstanceType<T>>
    private _values?: any[]

    constructor(
        public target: T,
        public attributes?: CreationAttributesOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase(),
        public absolute: boolean = false
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this._bulk = Array.isArray(this.attributes)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columnsNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return Array.from(this._propertiesNames ?? this.getFields())
    }

    // ------------------------------------------------------------------------

    public get columnsValues(): any[] {
        return this._values ?? this.getValues()
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

    public fields(...names: CreationAttibutesKey<InstanceType<T>>[]): this {
        this._propertiesNames = new Set(names)
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
        this._propertiesNames = undefined
        this._values = undefined

        return this
    }

    // ------------------------------------------------------------------------

    public mapAttributes(): CreationAttributesOptions<InstanceType<T>> {
        return this.bulk
            ? this._values?.map(values => this.mapAttributeOption(values)) ?? (
                []
            )
            : this.mapAttributeOption(this._values as any[])
    }

    // Privates ---------------------------------------------------------------
    private columnsSQL(): string {
        return this.columnsNames.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return this.absolute
            ? this.handleValuesSQL()
            : this.placeholdersSQL()
    }

    // ------------------------------------------------------------------------

    private placeholdersSQL(): string {
        return this._bulk
            ? this.bulkPlaceholderSQL()
            : this.placeholderSetSQL()
    }

    // ------------------------------------------------------------------------

    private handleValuesSQL(): string {
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

    private placeholderSetSQL(): string {
        return `(${Array(this.columnsNames.length).fill('?').join(', ')})`
    }

    // ------------------------------------------------------------------------

    private bulkPlaceholderSQL(): string {
        return Array(
            (this.attributes as CreationAttibutesKey<InstanceType<T>>[]).length
        )
            .fill(this.placeholderSetSQL())
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private getFields(): AttributesNames<InstanceType<T>> {
        return this._propertiesNames = new Set(
            this._bulk
                ? this.bulkPropertyNames()
                : this.propertyNames()
        ) as AttributesNames<InstanceType<T>>
    }

    // ------------------------------------------------------------------------

    private propertyNames(attributes?: CreationAttributes<InstanceType<T>>): (
        CreationAttibutesKey<InstanceType<T>>[]
    ) {
        return Object
            .keys(attributes ?? this.attributes!)
            .filter(key => this.metadata.columns.search(key)) as (
                CreationAttibutesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private bulkPropertyNames(): CreationAttibutesKey<InstanceType<T>>[] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[])
            .flatMap(att => this.propertyNames(att)) as (
                CreationAttibutesKey<InstanceType<T>>[]
            )
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] | any[][] {
        return this._bulk
            ? this.bulkCreateValues()
            : this.createValues()
    }

    // ------------------------------------------------------------------------

    private createValues(
        attributes: CreationAttributes<InstanceType<T>> = this.attributes as (
            CreationAttributes<InstanceType<T>>
        )
    ): any[] {
        return this.columnsNames.map(column =>
            attributes[column]
            ?? this.metadata.columns.search(column as string)?.defaultValue
            ?? null
        )
    }

    // ------------------------------------------------------------------------

    private bulkCreateValues(): any[][] {
        return (this.attributes as CreationAttributes<InstanceType<T>>[]).map(
            att => this.createValues(att)
        )
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
    type CreationAttibutesKey
}