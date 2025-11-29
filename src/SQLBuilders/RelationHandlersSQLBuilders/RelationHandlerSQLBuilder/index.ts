import { BaseEntity, ColumnsSnapshots } from "../../../Entities"
import { BasePolymorphicEntity } from "../../../Entities"

// Handlers 
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type { RelationMetadataType, } from "../../../Metadata"
import type { Constructor, Entity, TargetMetadata } from "../../../types"
import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateOrCreateAttibutes } from "../../UpdateOrCreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class RelationHandlerSQLBuilder<
    RelationMetadata extends RelationMetadataType,
    T extends Entity,
    R extends Entity
> {
    protected targetMetadata: TargetMetadata<Constructor<T>>
    protected relatedMetadata: TargetMetadata<Constructor<R>>

    constructor(
        protected metadata: RelationMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        this.targetMetadata = MetadataHandler.targetMetadata(
            this.target.constructor as Constructor<T>
        )
        this.relatedMetadata = MetadataHandler.targetMetadata(this.related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get targetAlias(): string {
        return this.targetMetadata.name
    }

    // ------------------------------------------------------------------------

    protected get targetTable(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get targetPrimary(): Extract<keyof T, string> {
        return this.targetMetadata.columns.primary.name as (
            Extract<keyof T, string>
        )
    }

    // ------------------------------------------------------------------------

    protected get targetPrimaryValue(): any {
        return PropertySQLHelper.valueSQL(this.target[this.targetPrimary])
    }

    // ------------------------------------------------------------------------

    protected get relatedAlias(): string {
        return this.relatedMetadata.name
    }

    // ------------------------------------------------------------------------

    protected get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    protected get relatedTableAlias(): string {
        return `${this.relatedTable} ${this.relatedAlias}`
    }

    // ------------------------------------------------------------------------

    protected get relatedPrimary(): Extract<keyof R, string> {
        return this.relatedMetadata.columns.primary.name as Extract<
            keyof R, string
        >
    }

    // Protecteds ------------------------------------------------------------
    protected abstract get includedAtrributes(): any

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected abstract fixedWhereSQL(): string

    // ------------------------------------------------------------------------

    protected selectSQL(): string {
        return `SELECT ${this.relatedColumnsSQL()} FROM ${(
            this.relatedTableAlias
        )}`
    }

    // ------------------------------------------------------------------------

    protected relatedColumnAsSQL(column: string): string {
        return `${column} AS ${this.relatedAlias}_${column}`
    }

    // ------------------------------------------------------------------------

    protected relatedColumnsSQL(): string {
        return this.relatedMetadata.columns
            .map(({ name }) => this.relatedColumnAsSQL(name))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected mergeAttributes<Att extends (
        CreationAttributes<R> |
        UpdateAttributes<R> |
        UpdateOrCreateAttibutes<R>
    )>(attributes: Att): Att {
        return { ...attributes, ...this.includedAtrributes }
    }

    // ------------------------------------------------------------------------

    protected attributesKeys(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )): (keyof R)[] {
        return Object.keys(this.mergeAttributes(attributes)) as (
            (keyof R)[]
        )
    }

    // ------------------------------------------------------------------------

    protected attributesValues(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )): any[] {
        return Object.values(this.mergeAttributes(attributes))
    }

    // ------------------------------------------------------------------------

    protected attributesEntries(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )): [(keyof R), any][] {
        return Object.entries(this.mergeAttributes(attributes)) as (
            [(keyof R), any][]
        )
    }

    // ------------------------------------------------------------------------

    protected setSQL(attributes: UpdateAttributes<R>): string {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    protected setValuesSQL(attributes: UpdateAttributes<R>): string {
        return Object
            .entries(this.onlyChangedAttributes(attributes))
            .map(([column, value]) => `${this.relatedAlias}.${column} = ${(
                PropertySQLHelper.valueSQL(value)
            )}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected onlyChangedAttributes(attributes: UpdateAttributes<R>): any {
        return (
            attributes instanceof BaseEntity ||
            attributes instanceof BasePolymorphicEntity
        )
            ? ColumnsSnapshots.changed(attributes)
            : attributes
    }

    // ------------------------------------------------------------------------

    protected placeholderSetSQL(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R> |
        number
    )): string {
        return `(${(
            Array(typeof attributes === 'number'
                ? attributes
                : this.attributesKeys(attributes).length
            )
                .fill('?')
                .join(', ')
        )})`
    }

    // ------------------------------------------------------------------------

    protected bulkPlaceholderSQL(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )[]): string {
        return Array(attributes.length)
            .fill(
                this.placeholderSetSQL(
                    this.bulkCreateColumns(attributes).length
                )
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected createValues<Att extends (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )>(
        attributes: Att | Att[]
    ): any[] | any[][] {
        if (Array.isArray(attributes)) {
            const columns = this.bulkCreateColumns(attributes) as (keyof Att)[]
            return attributes.map(att => columns.map(col => att[col] ?? null))
        }

        return Object.values(attributes)
    }

    // ------------------------------------------------------------------------

    protected bulkCreateColumns(attributes: (
        CreationAttributes<R> |
        UpdateAttributes<R>
    )[]): string[] {
        return Array.from(new Set<string>(
            attributes.flatMap(att => Object.keys(att))
        ))
    }
}