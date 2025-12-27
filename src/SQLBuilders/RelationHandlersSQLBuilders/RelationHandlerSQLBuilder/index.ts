import { BaseEntity, ColumnsSnapshots } from "../../../Entities"
import { Entity as EntityBase } from "../../../Entities"
import { v4 as UUIDV4 } from "uuid"

// Handlers 
import { MetadataHandler } from "../../../Metadata"

// Helpers
import { SQLString } from "../../../Handlers"

// Types
import type { RelationMetadataType, } from "../../../Metadata"

import type {
    Constructor,
    Entity,
    TargetMetadata
} from "../../../types"
import type { CreationAttributes } from "../../CreateSQLBuilder"

import type {
    RelationCreateManyAttributes
} from "../ManyRelationHandlerSQLBuilder"

import type {
    RelationCreationAttributes,
    RelationUpdateAttributes,
} from "../OneRelationHandlerSQLBuilder"

import type { Att, RelationAtt, ResolveAtt } from "./types"
export default abstract class RelationHandlerSQLBuilder<
    RelationMetadata extends RelationMetadataType,
    T extends Entity,
    R extends Entity
> {
    protected targetMetadata: TargetMetadata<T>
    protected relatedMetadata: TargetMetadata<R>

    private attributes?: Att<R>

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
        return this.targetMetadata.PK as (
            Extract<keyof T, string>
        )
    }

    // ------------------------------------------------------------------------

    protected get targetPrimaryValue(): any {
        return this.target[this.targetPrimary]
    }

    // ------------------------------------------------------------------------

    protected get targetPrimaryValueSQL(): string {
        return SQLString.value(this.targetPrimaryValue)
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
        return this.relatedMetadata.PK as Extract<
            keyof R, string
        >
    }

    // Protecteds ------------------------------------------------------------
    protected abstract get includedAtrributes(): any

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public creationAttributes<A extends RelationAtt<R>>(
        attributes: A
    ): ResolveAtt<R, A> {
        return this.attributes ??= Object.fromEntries(
            Object
                .entries({
                    ...this.PKPattern(),
                    ...attributes,
                    ...this.includedAtrributes
                })
                .filter(([key]) => this.relatedMetadata.columns.search(key))
        ) as any
    }

    // ------------------------------------------------------------------------

    public bulkCreationAttributes(
        attributes: RelationCreateManyAttributes<R>
    ): CreationAttributes<R>[] {
        return attributes.map(
            attribute => this.creationAttributes(attribute)
        ) as CreationAttributes<R>[]
    }

    // Protecteds -------------------------------------------------------------
    protected abstract fixedWhereSQL(): string

    // ------------------------------------------------------------------------

    protected selectSQL(): string {
        return `SELECT ${this.relatedColumnsSQL()} FROM ${(
            this.relatedTableAlias
        )}`
    }

    // ------------------------------------------------------------------------

    protected relatedColumnsSQL(): string {
        return this.relatedMetadata.columns
            .map(({ name }) => this.relatedColumnAsSQL(name))
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected relatedColumnAsSQL(column: string): string {
        return `${column} AS ${this.relatedAlias}_${column}`
    }

    // ------------------------------------------------------------------------

    protected attributesKeys(attributes: RelationAtt<R>): (keyof R)[] {
        return Object.keys(this.creationAttributes(attributes)) as (
            (keyof R)[]
        )
    }

    // ------------------------------------------------------------------------

    protected attributesValues(attributes: RelationAtt<R>): any[] {
        return Object.values(this.creationAttributes(attributes))
    }

    // ------------------------------------------------------------------------

    protected setSQL(attributes: RelationUpdateAttributes<R>): string {
        return `SET ${this.setValuesSQL(attributes)}`
    }

    // ------------------------------------------------------------------------

    protected setValuesSQL(attributes: RelationUpdateAttributes<R>): string {
        return Object
            .entries(attributes)
            .map(([column, value]) => `${this.relatedAlias}.${column} = ${(
                SQLString.value(value)
            )}`)
            .join(', ')
    }

    // ------------------------------------------------------------------------

    protected onlyChangedAttributes(
        attributes: R | RelationUpdateAttributes<R>
    ): RelationUpdateAttributes<R> {
        return (attributes as any) instanceof EntityBase
            ? ColumnsSnapshots.changed(attributes as R)
            : attributes as RelationUpdateAttributes<R>
    }

    // ------------------------------------------------------------------------

    protected patternAttributes(): any {
        return this.PKPattern()
    }

    // ------------------------------------------------------------------------

    protected PKPattern(): any {
        switch (this.relatedMetadata.columns.primary.pattern) {
            case 'polymorphic-id': return {
                [this.relatedPrimary]: `${this.related.name}_${UUIDV4()}`
            }

            default: return {}
        }
    }

    // ------------------------------------------------------------------------

    protected insertColumnsSQL(
        attributes: RelationCreationAttributes<R>
    ): string {
        return this.attributesKeys(attributes).join(', ')
    }

    // ------------------------------------------------------------------------

    protected insertValuesSQL(
        attributes: RelationCreationAttributes<R>
    ): string {
        return this.attributesValues(attributes)
            .map(value => SQLString.value(value))
            .join(', ')
    }
}