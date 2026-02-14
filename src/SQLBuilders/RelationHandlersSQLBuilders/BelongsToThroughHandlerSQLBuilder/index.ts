import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type { BelongsToThroughMetadata } from "../../../Metadata"
import type { Entity, Constructor } from "../../../types"
import type { CreateAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class BelongsToThroughHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends OneRelationHandlerSQLBuilder<BelongsToThroughMetadata, T, R> {
    constructor(
        protected metadata: BelongsToThroughMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // ------------------------------------------------------------------------

    protected override get relatedPrimary(): Extract<keyof R, string> {
        return `${this.relatedAlias}.${super.relatedPrimary}` as Extract<
            keyof R, string
        >
    }

    // Privates ---------------------------------------------------------------
    private get throughTable(): string {
        return this.metadata.throughTable
    }

    // ------------------------------------------------------------------------

    private get foreignKey(): string {
        return `${this.targetAlias}.${this.metadata.relatedFKName}`
    }

    // ------------------------------------------------------------------------

    private get throughForeignKey(): string {
        return this.metadata.throughFKName
    }

    // ------------------------------------------------------------------------

    private get throughPrimary(): string {
        return this.metadata.throughPrimary
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreateAttributes<R>): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(_: CreateAttributes<R>): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'updateOrCreateSQL', this.constructor.name
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE EXISTS (SELECT 1 FROM ${(
            this.relatedTableAlias
        )} WHERE EXISTS (SELECT 1 FROM ${(
            this.throughTable
        )} WHERE ${(
            this.throughForeignKey
        )} = ${this.relatedPrimary} AND ${(
            this.throughPrimary
        )} = ${this.foreignKey}))`
    }
}