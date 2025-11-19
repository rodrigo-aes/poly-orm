import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    MetadataHandler
} from "../../Metadata"

import { BaseEntity, ColumnsSnapshots } from "../../Entities"
import { BasePolymorphicEntity } from "../../Entities"

// SQL Builders
import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Handlers
import { ConditionalQueryJoinsHandler } from "../../Handlers"
import { ScopeMetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { Target, TargetMetadata } from "../../types"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { UpdateAttributes, UpdateAttributesKeys } from "./types"

export default class UpdateSQLBuilder<T extends Target> {
    protected metadata: TargetMetadata<T>

    private _propertiesNames?: UpdateAttributesKeys<InstanceType<T>>
    private _values?: any[]

    constructor(
        public target: T,
        public attributes: (
            UpdateAttributes<InstanceType<T>> |
            BaseEntity |
            BasePolymorphicEntity<any>
        ),
        public conditional?: ConditionalQueryOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.applyConditionalScope()

        if (this.attributes instanceof BasePolymorphicEntity) (
            this.attributes = this.attributes.toSourceEntity()
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get columns(): UpdateAttributesKeys<InstanceType<T>> {
        return this._propertiesNames = this._propertiesNames ?? Array.from(
            new Set(this.propertyNames())
        )
    }

    // ------------------------------------------------------------------------

    public get values(): any[] {
        return this._values ?? this.getValues()
    }

    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[
            (this.attributes as BasePolymorphicEntity<any>).entityType
            ]
            : this.metadata
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.targetMetadata.tableName} ${this.alias}
            ${this.joinsSQL()}
            ${this.setSQL()}
            ${this.whereSQL()}
        `)
    }

    // ------------------------------------------------------------------------

    public joinsSQL(): string {
        return this.conditional
            ? new ConditionalQueryJoinsHandler(
                this.target,
                this.conditional,
                this.alias
            )
                .joins()
                .map(join => join.SQL())
                .join(' ')
            : ''
    }

    // ------------------------------------------------------------------------

    public setSQL(): string {
        return `SET ${this.setValuesSQL()}`
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return this.conditional
            ? ConditionalSQLBuilder.where(
                this.target,
                this.conditional,
                this.alias
            )
                .SQL()
            : ''
    }

    // Privates ---------------------------------------------------------------
    private applyConditionalScope(): void {
        if (this.conditional) this.conditional = (
            ScopeMetadataHandler.applyScope(
                this.target,
                'conditional',
                this.conditional
            )
        )
    }
    // ------------------------------------------------------------------------

    private propertyNames(attributes?: UpdateAttributesKeys<InstanceType<T>>): (
        UpdateAttributesKeys<InstanceType<T>>
    ) {
        return Object
            .keys(attributes ?? this.attributes!)
            .filter(key => this.metadata.columns.search(key)) as (
                UpdateAttributesKeys<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    private getValues(): any[] {
        return this.columns.map(column =>
            (this.attributes as UpdateAttributes<InstanceType<T>>)[column]
            ?? null
        )
    }

    // ------------------------------------------------------------------------

    private setValuesSQL(): string {
        return Object.entries(this.updatedAttributes())
            .map(([col, val]) => `${this.alias}.${col} = ${(
                PropertySQLHelper.valueSQL(val)
            )}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private updatedAttributes(): any {
        return (
            this.attributes instanceof BaseEntity ||
            this.attributes instanceof BasePolymorphicEntity
        )
            ? ColumnsSnapshots.changed(this.attributes)
            : this.attributes
    }
}

export {
    type UpdateAttributes,
    type UpdateAttributesKeys as UpdateAttibutesKey
}