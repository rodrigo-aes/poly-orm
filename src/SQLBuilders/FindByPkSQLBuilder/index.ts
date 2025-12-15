import { PolymorphicEntityMetadata } from "../../Metadata"

// SQL Builders
import SelectSQLBuilder from "../SelectSQLBuilder"
import UnionSQLBuilder from "../UnionSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../types"

export default class FindByPkSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>

    constructor(
        public target: Constructor<T>,
        public pk: any,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            `${this.unionSQL()} ${this.selectSQL()} ${this.whereSQL()}`
        )
    }

    // ------------------------------------------------------------------------

    public unionSQL(): string {
        return this.metadata instanceof PolymorphicEntityMetadata
            ? new UnionSQLBuilder(
                this.metadata.tableName,
                this.metadata.target
            )
                .SQL()
            : ''
    }

    // ------------------------------------------------------------------------

    public selectSQL(): string {
        return new SelectSQLBuilder(this.target, undefined, this.alias).SQL()
    }

    // ------------------------------------------------------------------------

    public whereSQL(): string {
        return `WHERE ${this.alias}.${(
            this.metadata.columns.primary.name
        )} = ${PropertySQLHelper.valueSQL(this.pk)}`
    }
}