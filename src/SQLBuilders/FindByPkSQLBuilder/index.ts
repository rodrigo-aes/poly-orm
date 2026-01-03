import { PolymorphicEntityMetadata } from "../../Metadata"

// SQL Builders
import SelectSQLBuilder from "../SelectSQLBuilder"
import UnionSQLBuilder from "../UnionSQLBuilder"

// Handlers
import { MetadataHandler } from "../../Metadata"
import { SQLString } from "../../Handlers"

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
        return `${this.unionSQL()} ${this.selectSQL()} ${this.wherePKSQL()}`
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

    public wherePKSQL(): string {
        return `WHERE ${this.alias}.${this.metadata.PK} = ${(
            SQLString.value(this.pk)
        )}`
    }
}