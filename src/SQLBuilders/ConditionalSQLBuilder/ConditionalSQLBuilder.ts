// Query Builders
import AndSQLBuilder from "./AndSQLBuilder"
import OrSQLBuilder from "./OrSQLBuilder"

// Handlers
import { MetadataHandler, ScopeMetadataHandler } from "../../Metadata"

// Types
import type {
    Entity,
    Constructor,
    TargetMetadata,
} from "../../types"

import type { ConditionalQueryOptions } from "./types"
import type UnionSQLBuilder from "../UnionSQLBuilder"

export default abstract class ConditionalSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>
    public unions: UnionSQLBuilder[] = []

    constructor(
        public target: Constructor<T>,
        public options?: ConditionalQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)

        if (this.options) ScopeMetadataHandler.applyScope(
            this.target, 'conditional', this.options
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public conditionalSQL(and: boolean = false): string {
        if (this.options) {
            const sql = this.SQLBuilder().SQL()
            return sql ? (and ? ' AND ' : '') + sql : ''
        }

        return ''
    }

    // Privates ---------------------------------------------------------------
    private SQLBuilder(): AndSQLBuilder<T> | OrSQLBuilder<T> {
        const sqlBuilder = Array.isArray(this.options)
            ? new OrSQLBuilder(
                this.target,
                this.options,
                this.alias
            )
            : new AndSQLBuilder(
                this.target,
                this.options!,
                this.alias
            )

        this.unions = sqlBuilder.unions()
        return sqlBuilder
    }
}