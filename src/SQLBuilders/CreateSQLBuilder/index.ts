// Dependencies
import { v4 as UUIDV4 } from "uuid"

import { EntityMetadata } from "../../Metadata"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { SQLString } from "../../Handlers"

// Types
import type { BaseEntity } from "../../Entities"
import type { Constructor } from "../../types"
import type {
    CreateAttributes,
    CreateOneOrManyAttributes,
    CreateAttributesKey
} from "./types"

export default class CreateSQLBuilder<T extends BaseEntity> {
    protected metadata: EntityMetadata

    private _bulk: boolean
    private _cols?: Set<CreateAttributesKey<T>>
    private _vals?: any[]

    private _patternNames?: CreateAttributesKey<T>[]
    private _mapped?: CreateOneOrManyAttributes<T>

    constructor(
        public target: Constructor<T>,
        public attributes?: CreateOneOrManyAttributes<T>,
        public alias: string = target.name.toLowerCase(),
        public absolute: boolean = true
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this._bulk = Array.isArray(this.attributes)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get cols(): CreateAttributesKey<T>[] {
        return Array.from(this._cols ??= this.handleNames())
    }

    // ------------------------------------------------------------------------

    public get vals(): any[] {
        return this._vals ??= this.handleValues()
    }

    // Setters ================================================================
    public set bulk(bulk: boolean) {
        this._bulk = bulk
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `INSERT INTO ${this.metadata.tableName} (${(
            this.columnsSQL()
        )}) VALUES ${this.valuesSQL()}`
    }

    // ------------------------------------------------------------------------

    public fields(...names: CreateAttributesKey<T>[]): this {
        this._cols = new Set(names)
        return this
    }

    // ------------------------------------------------------------------------

    public values(...values: any[]): this {
        this._vals = values
        return this
    }

    // ------------------------------------------------------------------------

    public setData(attributes: CreateAttributes<T> | CreateAttributes<T>[]): (
        this
    ) {
        this.attributes = attributes
        this._cols = undefined
        this._vals = undefined

        return this
    }

    // ------------------------------------------------------------------------

    public mapAttributes(): CreateAttributes<T> | CreateAttributes<T>[] {
        return this._mapped ??= (
            this.bulk
                ? this.vals?.map(
                    values => this.mapAttributeOption(values)
                ) ?? []
                : this.mapAttributeOption(this.vals as any[])
        )
    }

    // Privates ---------------------------------------------------------------
    private columnsSQL(): string {
        return this.cols.join(', ')
    }

    // ------------------------------------------------------------------------

    private valuesSQL(): string {
        return Array.isArray(this.vals[0])
            ? this.vals
                .map(values => this.valueSetSQL(values))
                .join(', ')

            : this.valueSetSQL(this.vals)
    }

    // ------------------------------------------------------------------------

    private valueSetSQL(values: any[]): string {
        return `(${values.map(v => SQLString.value(v)).join(', ')})`
    }

    // ------------------------------------------------------------------------

    private handleNames(): Set<CreateAttributesKey<T>> {
        return new Set(this._bulk
            ? this.bulkPropertyNames()
            : this.propertyNames()
        ) as Set<CreateAttributesKey<T>>
    }

    // ------------------------------------------------------------------------

    private bulkPropertyNames(): CreateAttributesKey<T>[] {
        return (this.attributes as CreateAttributes<T>[])
            .flatMap(att => this.propertyNames(att)) as (
                CreateAttributesKey<T>[]
            )
    }

    // ------------------------------------------------------------------------

    private propertyNames(
        attributes?: CreateAttributes<T>
    ): CreateAttributesKey<T>[] {
        return this.patternPropsNames().concat(Object
            .keys(attributes ?? this.attributes!)
            .filter(key => this.metadata.columns.search(key)) as (
                CreateAttributesKey<T>[]
            )
        )
    }

    // ------------------------------------------------------------------------

    private patternPropsNames(): CreateAttributesKey<T>[] {
        return this._patternNames ??= this.PKPatternName()
    }

    // ------------------------------------------------------------------------

    private PKPatternName(): CreateAttributesKey<T>[] {
        switch (this.metadata.columns.primary.pattern) {
            case 'polymorphic-id': return [
                this.metadata.PK as CreateAttributesKey<T>
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
        return (this.attributes as CreateAttributes<T>[])
            .map(att => this.createValues(att))
    }

    // ------------------------------------------------------------------------

    private createValues(
        attributes: CreateAttributes<T> = this.attributes as (
            CreateAttributes<T>
        )
    ): any[] {
        return this.cols.map(column =>
            attributes[column]
            ?? this.patternCreateValue(column)
            ?? this.metadata.columns.search(column as string)?.defaultValue
            ?? null
        )
    }

    // ------------------------------------------------------------------------

    private patternCreateValue(column: CreateAttributesKey<T>): any {
        switch (this.metadata.columns.findOrThrow(column).pattern) {
            case 'polymorphic-id': return `${this.target.name}_${UUIDV4()}`

            default: return undefined
        }
    }

    // ------------------------------------------------------------------------

    private mapAttributeOption(values: any[]): CreateAttributes<T> {
        return Object.fromEntries(
            values.map((value, index) => [this.cols[index], value])
        ) as CreateAttributes<T>
    }
}

export {
    type CreateAttributes,
    type CreateOneOrManyAttributes,
    type CreateAttributesKey
}