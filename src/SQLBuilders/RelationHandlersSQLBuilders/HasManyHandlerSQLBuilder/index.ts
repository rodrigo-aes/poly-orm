import ManyRelationHandlerSQLBuilder from "../ManyRelationHandlerSQLBuilder"

// Types
import type {
    HasManyMetadata,
} from "../../../Metadata"

import type {
    Entity,
    Constructor
} from "../../../types"

export default class HasManyHandlerSQLBuilder<
    T extends Entity,
    R extends Entity
> extends ManyRelationHandlerSQLBuilder<HasManyMetadata, T, R> {
    constructor(
        protected metadata: HasManyMetadata,
        protected target: T,
        protected related: Constructor<R>
    ) {
        super(metadata, target, related)
    }

    // Getters ================================================================
    // Protecteds -------------------------------------------------------------
    protected get includedAtrributes(): any {
        return { [this.metadata.RefCol.name]: this.targetPrimaryValue }
    }

    // Privates ---------------------------------------------------------------
    private get foreignKey(): string {
        return `${this.relatedAlias}.${(
            this.relatedColumnAsSQL(this.metadata.RefCol.name)
        )}`
    }

    // Instance Methods =======================================================
    // Protecteds -------------------------------------------------------------
    protected fixedWhereSQL(): string {
        return `WHERE ${this.foreignKey} = ${this.targetPrimaryValueSQL}`
    }
}