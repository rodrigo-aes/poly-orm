import {
    PolymorphicEntityMetadata,
    type PolymorphicColumnMetadata
} from "../../Metadata"

import type { EntityMetadata } from "../../Metadata"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { PolymorphicEntityTarget } from "../../types"

export default class UnionSQLBuilder {
    protected metadata: PolymorphicEntityMetadata

    constructor(
        public name: string,
        public target: PolymorphicEntityTarget
    ) {
        this.metadata = PolymorphicEntityMetadata.findOrThrow(this.target)
    }

    // Getters ================================================================
    // Privates ---------------------------------------------------------------
    private get sources(): EntityMetadata[] {
        return Object.values(this.metadata.sourcesMetadata)
    }

    // ------------------------------------------------------------------------

    private get restColumns(): PolymorphicColumnMetadata[] {
        return this.metadata.columns.filter(
            ({ name }) => !['primaryKey', 'entityType'].includes(name)
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(
            `WITH ${this.name} AS (${this.vitualTablesSQL()})`
        )
    }

    // Privates ---------------------------------------------------------------
    private vitualTablesSQL(): string {
        return this.sources
            .map(source => this.tableSQL(source))
            .join(' UNION ALL ')
    }

    // ------------------------------------------------------------------------

    private tableSQL(source: EntityMetadata): string {
        return `SELECT ${this.columnsSQL(source)} FROM ${source.tableName}`
    }

    // ------------------------------------------------------------------------

    private columnsSQL(source: EntityMetadata): string {
        return [
            this.primaryKeySQL(source),
            this.entityTypeSQL(source),
            ...this.restColumnsSQL(source)
        ]
            .join(', ')
    }

    // ------------------------------------------------------------------------

    private primaryKeySQL(source: EntityMetadata): string {
        return `${source.PK} AS primaryKey`
    }

    // ------------------------------------------------------------------------

    private entityTypeSQL(source: EntityMetadata): string {
        return `"${source.target.name}" AS entityType`
    }

    // ------------------------------------------------------------------------

    private restColumnsSQL(source: EntityMetadata): string[] {
        return this.restColumns.map(column => `${(
            column.targetSource(source.target)?.name ?? 'NULL'
        )} AS ${column.name}`)
    }
}