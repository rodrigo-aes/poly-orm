import {
    EntityMetadata,
    PolymorphicEntityMetadata,
    MetadataHandler
} from "../../Metadata"

import {
    Entity as EntityBase,
    BaseEntity,
    BasePolymorphicEntity,
    ColumnsSnapshots
} from "../../Entities"

// SQL Builders
import ConditionalSQLBuilder from "../ConditionalSQLBuilder"

// Handlers
import { SQLString, ConditionalQueryJoinsHandler } from "../../Handlers"
import { ScopeMetadataHandler } from "../../Metadata"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../types"
import type { ConditionalQueryOptions } from "../ConditionalSQLBuilder"
import type { UpdateAttributes, UpdateAttributesKeys } from "./types"

export default class UpdateSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>

    private _att: Entity | UpdateAttributes<T>

    constructor(
        public target: Constructor<T>,
        attributes: Entity | UpdateAttributes<T>,
        public conditional?: ConditionalQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
        this.conditional = ScopeMetadataHandler.apply(
            this.target, 'conditional', this.conditional
        )
        this._att = attributes instanceof BasePolymorphicEntity
            ? attributes.toSource()
            : attributes
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get attributes(): UpdateAttributes<T> {
        return this._att instanceof EntityBase
            ? ColumnsSnapshots.changed(this._att)
            : this._att
    }

    // Protecteds -------------------------------------------------------------
    protected get targetMetadata(): EntityMetadata {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? this.metadata.sourcesMetadata[(this._att as any).entityType]
            : this.metadata
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `UPDATE ${this.targetMetadata.tableName} ${this.alias} ${(
            this.joinsSQL()
        )} ${this.setSQL()} ${this.whereSQL()}`
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
        return Object
            .entries(this.attributes)
            .map(([col, val]) => `${this.alias}.${col} = ${(
                SQLString.value(val)
            )}`)
            .join(', ')
    }
}

export {
    type UpdateAttributes,
    type UpdateAttributesKeys
}