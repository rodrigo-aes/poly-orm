import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"
import { BasePolymorphicEntity } from "../../../Entities"

// Types
import type { PolymorphicHasManyMetadata } from "../../../Metadata"
import type { Target as TargetType } from "../../../types"

export default class PolymorphicHasManyHandlerSQLBuilder<
    Target extends object,
    Related extends TargetType
> extends ManyRelationHandlerSQLBuilder<
    PolymorphicHasManyMetadata,
    Target,
    Related
> {
    constructor(
        protected metadata: PolymorphicHasManyMetadata,
        protected target: Target,
        protected related: Related
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get _targetPrimaryValue(): any {
        return this.target instanceof BasePolymorphicEntity
            ? this.target.primaryKey
            : this.targetPrimaryValue
    }

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
        return (
            `WHERE ${this.aliasedForeignKey} = ${this.targetPrimaryValue}` + (
                this.andTypeKeySQL
            )
        )
    }
}