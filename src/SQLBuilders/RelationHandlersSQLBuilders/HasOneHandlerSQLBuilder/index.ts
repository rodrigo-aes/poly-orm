import OneRelationHandlerSQLBuilder from "../OneRelationHandlerSQLBuilder"

// Types
import type { HasOneMetadata } from "../../../Metadata"

import type { Constructor, Entity } from "../../../types"

export default class HasOneHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends OneRelationHandlerSQLBuilder<HasOneMetadata, T, R> {
    constructor(
        protected metadata: HasOneMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return { [this.metadata.foreignKey.name]: this.targetPrimaryValue }
    }

    // Privates ---------------------------------------------------------------
    private get foreignKey(): string {
        return `${this.relatedAlias}.${(
            this.relatedColumnAsSQL(this.metadata.foreignKey.name)
        )}`
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE ${this.foreignKey} = ${this.targetPrimaryValueSQL}`
    }
}