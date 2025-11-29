import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type { BelongsToMetadata } from "../../../Metadata"

import type {
    Entity,
    Constructor,
    EntityProperties,
    OptionalNullable
} from "../../../types"

import { CreationAttributes } from "../../CreateSQLBuilder"

// Exceptions
import PolyORMException from "../../../Errors"

export default class BelongsToHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends OneRelationHandlerSQLBuilder<BelongsToMetadata, T, R> {
    constructor(
        protected metadata: BelongsToMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public override get relatedPrimary(): Extract<keyof R, string> {
        return `${this.relatedAlias}.${super.relatedPrimary}` as Extract<
            keyof R, string
        >
    }

    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return {}
    }

    // Privates ---------------------------------------------------------------
    private get foreignKeyValue(): any {
        return this.target[this.metadata.foreignKey.name as (
            keyof T
        )]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override createSQL(_: CreationAttributes<R>): [string, any[]] {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'createSQL', this.constructor.name
        )
    }

    // ------------------------------------------------------------------------

    public override updateOrCreateSQL(
        _: Partial<OptionalNullable<EntityProperties<R>>>
    ): string {
        throw PolyORMException.Common.instantiate(
            'NOT_CALLABLE_METHOD', 'updateOrCreateSQL', this.constructor.name
        )
    }

    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE ${this.relatedPrimary} = ${this.foreignKeyValue}`
    }
}