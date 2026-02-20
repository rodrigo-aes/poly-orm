import {
    PolymorphicEntityMetadata,
    type PolymorphicColumnMetadata
} from "../../Metadata"

import type { EntityMetadata } from "../../Metadata"

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
            ({ name }) => !['PK', 'TK'].includes(name)
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `WITH ${this.name} AS (${this.unionsSQL()})`
    }

    // Privates ---------------------------------------------------------------
    private unionsSQL(): string {
        return this.sources
            .map(source => this.vTableSQL(source))
            .join(' UNION ALL ')
    }

    // ------------------------------------------------------------------------

    private vTableSQL(source: EntityMetadata): string {
        return `SELECT ${this.columnsSQL(source)} FROM ${source.tableName}`
    }

    // ------------------------------------------------------------------------

    private columnsSQL(source: EntityMetadata): string {
        return `${this.PKSQL(source)}, ${this.ETSQL(source)}, ${(
            this.restColumnsSQL(source).join(', ')
        )}`
    }

    // ------------------------------------------------------------------------

    private PKSQL(source: EntityMetadata): string {
        return `${source.PK} AS PK`
    }

    // ------------------------------------------------------------------------

    private ETSQL(source: EntityMetadata): string {
        return `"${source.target.name}" AS TK`
    }

    // ------------------------------------------------------------------------

    private restColumnsSQL(source: EntityMetadata): string[] {
        return this.restColumns.map(column => `${(
            column.targetSource(source.target)?.name ?? 'NULL'
        )} AS ${column.name}`)
    }
}