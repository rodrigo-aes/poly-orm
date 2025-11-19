import { BaseEntity, ColumnsSnapshots } from "../../../Entities"
import { BasePolymorphicEntity } from "../../../Entities"

// Handlers 
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { PropertySQLHelper } from "../../../Helpers"

// Types
import type { RelationMetadataType, } from "../../../Metadata"
import type { Target as TargetType, TargetMetadata } from "../../../types"
import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateOrCreateAttibutes } from "../../UpdateOrCreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export default abstract class RelationHandlerSQLBuilder<
    RelationMetadata extends RelationMetadataType,
    Target extends object,
    Related extends TargetType
> {
    protected targetMetadata: TargetMetadata<any>
    protected relatedMetadata: TargetMetadata<Related>

    constructor(
        protected metadata: RelationMetadata,
        protected target: Target,
        protected related: Related
    ) {
        this.targetMetadata = MetadataHandler.targetMetadata(
            this.target.constructor as TargetType
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

    protected get targetPrimary(): Extract<keyof Target, string> {
        return this.targetMetadata.columns.primary.name as (
            Extract<keyof Target, string>
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

    protected get relatedPrimary(): (
        Extract<keyof InstanceType<Related>, string>
    ) {
        return this.relatedMetadata.columns.primary.name as (
            Extract<keyof InstanceType<Related>, string>
        )
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

    protected mergeAttributes<
        Att extends (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>> |
            UpdateOrCreateAttibutes<InstanceType<Related>>
        )
    >(attributes: Att): Att {
        return { ...attributes, ...this.includedAtrributes }
    }

    // ------------------------------------------------------------------------

    protected attributesKeys(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): (keyof Related)[] {
        return Object.keys(this.mergeAttributes(attributes)) as (
            (keyof Related)[]
        )
    }

    // ------------------------------------------------------------------------

    protected attributesValues(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): any[] {
        return Object.values(this.mergeAttributes(attributes))
    }

    // ------------------------------------------------------------------------

    protected attributesEntries(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    ): [(keyof Related), any][] {
        return Object.entries(this.mergeAttributes(attributes)) as (
            [(keyof Related), any][]
        )
    }

    // ------------------------------------------------------------------------

    protected setSQL(attributes: UpdateAttributes<InstanceType<Related>>): (
        string
    ) {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    protected setValuesSQL(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): string {
        return Object
            .entries(this.onlyChangedAttributes(attributes))
            .map(([column, value]) => `${this.relatedAlias}.${column} = ${(
                PropertySQLHelper.valueSQL(value)
            )}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected onlyChangedAttributes(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): any {
        return (
            attributes instanceof BaseEntity ||
            attributes instanceof BasePolymorphicEntity
        )
            ? ColumnsSnapshots.changed(attributes)
            : attributes
    }

    // ------------------------------------------------------------------------

    protected placeholderSetSQL(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        ) | number
    ): string {
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

    protected bulkPlaceholderSQL(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )[]
    ): string {
        return Array(attributes.length)
            .fill(
                this.placeholderSetSQL(
                    this.bulkCreateColumns(attributes).length
                )
            )
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected createValues<
        Att extends (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )
    >(attributes: Att | Att[]): any[] | any[][] {
        if (Array.isArray(attributes)) {
            const columns = this.bulkCreateColumns(attributes) as (keyof Att)[]
            return attributes.map(att => columns.map(col => att[col] ?? null))
        }

        return Object.values(attributes)
    }

    // ------------------------------------------------------------------------

    protected bulkCreateColumns(
        attributes: (
            CreationAttributes<InstanceType<Related>> |
            UpdateAttributes<InstanceType<Related>>
        )[]
    ): string[] {
        return Array.from(new Set<string>(
            attributes.flatMap(att => Object.keys(att))
        ))
    }
}