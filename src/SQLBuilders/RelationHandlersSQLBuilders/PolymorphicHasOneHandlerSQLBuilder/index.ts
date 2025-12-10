import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"
import { BasePolymorphicEntity } from "../../../Entities"

// Types
import type { PolymorphicHasOneMetadata } from "../../../Metadata"
import type { Entity, Constructor } from "../../../types"

export default class PolymorphicHasOneHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends OneRelationHandlerSQLBuilder<
    PolymorphicHasOneMetadata,
    T,
    R
> {
    constructor(
        protected metadata: PolymorphicHasOneMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {
            [this.foreignKey]: this.targetPrimaryValue,
            ...(this.typeKey ? { [this.typeKey]: this.targetType } : undefined)
        }
    }

    // Privates ---------------------------------------------------------------
    private get foreignKey(): string {
        return this.metadata.FKName
    }

    // ------------------------------------------------------------------------

    private get aliasedForeignKey(): string {
        return `${this.relatedAlias}.${this.foreignKey}`
    }

    // ------------------------------------------------------------------------

    private get typeKey(): string | undefined {
        return this.metadata.TKName
    }

    // ------------------------------------------------------------------------

    private get targetType(): string {
        return this.target instanceof BasePolymorphicEntity
            ? this.target.entityType
            : this.metadata.parentType
    }

    // ------------------------------------------------------------------------

    private get andTypeKeySQL(): string {
        return this.typeKey
            ? ` AND ${this.relatedAlias}.${this.typeKey} = "${(
                this.targetType
            )}"`
            : ''
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE ${this.aliasedForeignKey} = ${(
            this.targetPrimaryValueSQL
        )}` + this.andTypeKeySQL
    }
}