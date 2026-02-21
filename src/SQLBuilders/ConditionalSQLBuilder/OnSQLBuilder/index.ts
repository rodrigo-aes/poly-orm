import ConditionalSQLBuilder from "../ConditionalSQLBuilder"
import { BasePolymorphicEntity } from "../../../Entities"

import {
    MetadataHandler,

    type RelationMetadata,
    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata
} from "../../../Metadata"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../../types"
import type { ConditionalQueryOptions } from "../types"

export default class OnSQLBuilder<T extends Entity, R extends Entity>
    extends ConditionalSQLBuilder<R> {
    private parentMetadata: TargetMetadata<T>

    constructor(
        public parentTarget: Constructor<T>,
        public target: Constructor<R>,
        public relation: RelationMetadata,
        public options?: ConditionalQueryOptions<R>,
        public parentAlias: string = parentTarget.name.toLowerCase(),
        public alias: string = relation.name,
    ) {
        super(target, options, alias)
        this.parentMetadata = MetadataHandler.targetMetadata(this.parentTarget)
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get relatedPK(): string {
        return `${this.alias}.${this.metadata.PK}`
    }

    // ------------------------------------------------------------------------

    private get parentPK(): string {
        return `${this.parentAlias}.${this.parentMetadata.PK}`
    }

    // ------------------------------------------------------------------------

    private get isPolyParent(): boolean {
        return this.parentTarget.prototype instanceof BasePolymorphicEntity
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `ON ${this.fixedSQL()} ${this.conditionalSQL(true)}`
    }

    // ------------------------------------------------------------------------

    public fixedSQL(): string {
        switch (this.relation.type) {
            case "HasOne":
            case "HasMany": return this.hasSQL(this.relation)

            // ----------------------------------------------------------------

            case "HasOneThrough":
            case "HasManyThrough": return this.hasThroughSQL(this.relation)

            // ----------------------------------------------------------------

            case "BelongsTo": return this.belongsToSQL(this.relation)

            // ----------------------------------------------------------------

            case "BelongsToThrough": return this.belongsToThroughSQL(
                this.relation
            )

            // ----------------------------------------------------------------

            case "BelongsToMany": return this.belongsToManySQL(this.relation)

            // ----------------------------------------------------------------

            case "PolymorphicHasOne":
            case "PolymorphicHasMany": return this.polymorphicHasSQL(
                this.relation
            )

            // ----------------------------------------------------------------

            case "PolymorphicBelongsTo": return this.polymorphicBelongsToSQL(
                this.relation
            )
        }
    }

    // Privates ---------------------------------------------------------------
    private hasSQL(rel: HasOneMetadata | HasManyMetadata): string {
        return `${this.relatedCol(rel.FK)} = ${this.parentPK}`
    }

    // ------------------------------------------------------------------------

    private hasThroughSQL(
        {
            relatedTable,
            throughTable,
            throughPK,
            FK,
            throughFK
        }: HasOneThroughMetadata | HasManyThroughMetadata
    ): string {
        return `EXISTS (SELECT 1 FROM ${relatedTable} ${(
            this.alias
        )} WHERE EXISTS (SELECT 1 FROM ${throughTable} WHERE ${(
            throughFK
        )} = ${this.parentPK} AND ${this.relatedCol(FK)} = ${throughPK}))`
    }

    // ------------------------------------------------------------------------

    private belongsToSQL(rel: BelongsToMetadata): string {
        return `${this.relatedPK} = ${this.parentCol(rel.FK)}`
    }

    // ------------------------------------------------------------------------

    private belongsToThroughSQL(
        {
            relatedTable,
            throughTable,
            throughPK,
            FK,
            throughFK
        }: BelongsToThroughMetadata
    ): string {
        return `EXISTS(SELECT 1 FROM ${relatedTable} ${(
            this.alias
        )} WHERE EXISTS(SELECT 1 FROM ${throughTable} WHERE ${(
            throughFK
        )} = ${this.relatedPK} AND ${(throughPK)} = ${this.parentCol(FK)}))`
    }

    // ------------------------------------------------------------------------

    private belongsToManySQL(
        { relatedTable, JT, parentFK, FK }: BelongsToManyMetadata
    ): string {
        return `EXISTS(SELECT 1 FROM ${relatedTable} ${(
            this.alias
        )} WHERE EXISTS(SELECT 1 FROM ${JT} WHERE ${parentFK} = ${(
            this.parentPK
        )} AND ${FK} = ${this.relatedPK}))`
    }

    // ------------------------------------------------------------------------

    private polymorphicHasSQL({ FK, TK, parentType }: (
        PolymorphicHasOneMetadata |
        PolymorphicHasManyMetadata
    )): string {
        return `${this.relatedCol(FK)} = ${this.parentPK}` + (
            TK
                ? ` AND ${this.parentCol(TK)} = ${this.resolveTK(parentType)}`
                : ''
        )
    }

    // ------------------------------------------------------------------------

    private polymorphicBelongsToSQL({ FK, TK, relatedTable }: (
        PolymorphicBelongsToMetadata
    )): string {
        const alias = this.resolveAlias(relatedTable)
        return `${alias}.PK = ${this.parentCol(FK)}` + (
            TK
                ? ` AND ${alias}.TK = ${this.parentCol(TK)}`
                : ''
        )
    }

    // ------------------------------------------------------------------------

    private relatedCol(column: string): string {
        return `${this.alias}.${column}`
    }

    // ------------------------------------------------------------------------

    private parentCol(column: string): string {
        return `${this.parentAlias}.${column}`
    }

    // ------------------------------------------------------------------------

    private resolveAlias(fixedTableName: string): string {
        return this.isPolyParent ? this.parentAlias : fixedTableName
    }

    // ------------------------------------------------------------------------

    private resolveTK(type: string): string {
        return this.isPolyParent ? `${this.parentAlias}.TK` : `'${type}'`
    }
}