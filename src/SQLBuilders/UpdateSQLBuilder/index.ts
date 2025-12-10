import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    MetadataHandler
} from "../../Metadata"

import {
    Entity,
    BaseEntity,
    BasePolymorphicEntity,
    ColumnsSnapshots
} from "../../Entities"

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

    private filtered: boolean = false

    constructor(
        public target: T,
        public _attributes: (
            UpdateAttributes<InstanceType<T>> |
            BaseEntity |
            BasePolymorphicEntity<any>
        ),
        public conditional?: ConditionalQueryOptions<InstanceType<T>>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.applyConditionalScope()

        if (this._attributes instanceof BasePolymorphicEntity) (
            this._attributes = this._attributes.toSourceEntity()
        )
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get attributes(): UpdateAttributes<InstanceType<T>> {
        return (
            this.filtered
                ? this._attributes
                : Object.fromEntries(
                    Object.entries(
                        this._attributes instanceof Entity
                            ? ColumnsSnapshots.changed(this._attributes)
                            : this._attributes
                    )
                        .filter(([key]) => this.metadata.columns.search(key))
                )
        ) as UpdateAttributes<InstanceType<T>>
    }

    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[(
                (this._attributes as BasePolymorphicEntity<any>).entityType
            )]
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

    // ------------------------------------------------------------------------

    public setValuesSQL(): string {
        return Object.entries(this.attributes)
            .map(([col, val]) => `${this.alias}.${col} = ${(
                PropertySQLHelper.valueSQL(val)
            )}`)
            .join(', ')
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
}

export {
    type UpdateAttributes,
    type UpdateAttributesKeys as UpdateAttibutesKey
}