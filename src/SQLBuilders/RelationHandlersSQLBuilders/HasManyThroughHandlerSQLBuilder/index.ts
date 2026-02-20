import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

// Types
import type {
    HasManyThroughMetadata,
} from "../../../Metadata"

import type {
    Entity,
    Constructor
} from "../../../types"

import type { CreateAttributes } from "../../CreateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class HasManyThroughHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends ManyRelationHandlerSQLBuilder<HasManyThroughMetadata, T, R> {
    constructor(
        protected metadata: HasManyThroughMetadata,
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

    // Privates ---------------------------------------------------------------
    private get throughTable(): string {
        return this.metadata.throughTable
    }

    // ------------------------------------------------------------------------

    private get foreignKey(): string {
        return `${this.relatedAlias}.${this.metadata.FK}`
    }

    // ------------------------------------------------------------------------

    private get throughForeignKey(): string {
        return this.metadata.throughFK
    }

    // ------------------------------------------------------------------------

    private get throughPrimary(): string {
        return this.metadata.throughPK
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreateAttributes<R>): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override createManySQL(_: CreateAttributes<R>[]): string {
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
        )} WHERE ${this.throughForeignKey} = ${(
            this.targetPrimaryValueSQL
        )} AND ${this.foreignKey} = ${this.throughPrimary}))`
    }
}
