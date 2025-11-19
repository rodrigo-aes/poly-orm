import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"
import {
    PolymorphicEntityMetadata,
    type EntityMetadata
} from "../../../Metadata"


// SQL Builders
import UnionSQLBuilder from "../../UnionSQLBuilder"
import { InternalPolymorphicEntities } from "../../../Entities"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../../Helpers"

// Types
import type {
    PolymorphicBelongsToMetadata,
} from "../../../Metadata"

import type { PolymorphicEntityTarget } from "../../../types"

import { CreationAttributes } from "../../CreateSQLBuilder"
import { OptionalNullable } from "../../../types/Properties"
import { EntityProperties } from "../../../types"

import type { UpdateAttributes } from "../../UpdateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class PolymorphicBelongsToHandlerSQLBuilder<
    Target extends object,
    Related extends PolymorphicEntityTarget
> extends OneRelationHandlerSQLBuilder<
    PolymorphicBelongsToMetadata,
    Target,
    Related
> {
    private _sourceMetadata?: EntityMetadata

    constructor(
        protected metadata: PolymorphicBelongsToMetadata,
        protected target: Target,
        protected related: Related = InternalPolymorphicEntities.get(
            metadata.relatedTargetName
        ) as Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // Privates ---------------------------------------------------------------
    private get union(): string {
        return this.metadata.relatedTable
    }

    // ------------------------------------------------------------------------

    private get foreignKey(): keyof Target {
        return this.metadata.FKName as keyof Target
    }

    // ------------------------------------------------------------------------

    private get foreignKeyValue(): any {
        return this.target[this.foreignKey]
    }

    // ------------------------------------------------------------------------

    private get typeKey(): keyof Target | undefined {
        return this.metadata.TKName as keyof Target | undefined
    }

    // ------------------------------------------------------------------------

    private get sourceType(): string {
        return this.typeKey
            ? this.target[this.typeKey] as string
            : (this.target[this.foreignKey] as string).split('_')[0]
    }

    // ------------------------------------------------------------------------

    private get sourceMetadata(): EntityMetadata {
        return this._sourceMetadata = this._sourceMetadata ?? (
            this.metadata.relatedMetadata instanceof PolymorphicEntityMetadata
                ? this.metadata.relatedMetadata.sourcesMetadata[(
                    this.sourceType
                )]
                : this.metadata.relatedMetadata[this.sourceType]
        ) as EntityMetadata
    }

    // ------------------------------------------------------------------------

    private get sourceTable(): string {
        return this.sourceMetadata.tableName
    }

    // ------------------------------------------------------------------------

    private get sourceAlias(): string {
        return this.sourceMetadata.name.toLowerCase()
    }

    // ------------------------------------------------------------------------

    private get sourcePrimary(): string {
        return `${this.sourceAlias}.${(
            this.sourceMetadata.columns.primary.name
        )}`
    }
    // ------------------------------------------------------------------------

    private get sourceWhereSQL(): string {
        return `WHERE ${this.sourcePrimary} = ${this.foreignKeyValue}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreationAttributes<InstanceType<Related>>): (
        [string, any[]]
    ) {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(
        _: Partial<OptionalNullable<EntityProperties<InstanceType<Related>>>>
    ): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'updateOrCreateSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override updateSQL(
        attributes: Partial<EntityProperties<InstanceType<Related>>>
    ): string {
        return SQLStringHelper.normalizeSQL(`
            UPDATE ${this.sourceTable} ${this.sourceAlias} 
            ${this.setSQL(attributes)}
            ${this.sourceWhereSQL}
        `)
    }

    // ------------------------------------------------------------------------

    public override deleteSQL(): string {
        return `DELETE FROM ${this.sourceTable} ${this.sourceWhereSQL}`
    }

    // Protecteds -------------------------------------------------------------
    protected override selectSQL(): string {
        return `${this.unionSQL()} ${super.selectSQL()}`
    }

    // ------------------------------------------------------------------------

    protected override setValuesSQL(
        attributes: UpdateAttributes<InstanceType<Related>>
    ): string {
        return Object
            .entries(this.onlyChangedAttributes(attributes))
            .map(([column, value]) => `${this.sourceAlias}.${column} = ${(
                PropertySQLHelper.valueSQL(value)
            )}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected fixedWhereSQL(): string {
        return `WHERE ${this.union}.primaryKey = ${(
            this.foreignKeyValue
        )} AND ${this.union}.entityType = "${this.sourceType}"`
    }

    // Privates ---------------------------------------------------------------
    private unionSQL(): string {
        return new UnionSQLBuilder(
            this.metadata.relatedTable,
            this.related
        )
            .SQL()
    }
}