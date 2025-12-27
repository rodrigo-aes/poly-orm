// Query Builders
import AndSQLBuilder from "../AndSQLBuilder"
import OrSQLBuilder from "../OrSQLBuilder"

// Symbols
import { Case } from "./Symbol"

// Handlers
import { MetadataHandler } from "../../../Metadata"
import { SQLString } from '../../../Handlers'

// Types
import type { Entity, Constructor, TargetMetadata } from "../../../types"
import type {
    CaseQueryOptions,
    CaseQueryTuple,
    WhenQueryOption,
    ElseQueryOption,
} from "./types"

export default class CaseSQLBuilder<T extends Entity> {
    protected metadata: TargetMetadata<T>

    constructor(
        public target: Constructor<T>,
        public options: CaseQueryOptions<T>,
        public as?: string,
        public alias: string = target.name.toLowerCase()
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)!
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get whenClauses(): CaseQueryTuple<T>[] {
        return Array.isArray(this.lastOption)
            ? this.options
            : this.options.slice(0, -1)
    }

    // ------------------------------------------------------------------------

    public get elseClause(): ElseQueryOption | undefined {
        if (!Array.isArray(this.lastOption)) return this.lastOption
    }

    // Privates ---------------------------------------------------------------
    private get lastOption(): (
        CaseQueryTuple<T> | ElseQueryOption
    ) {
        return this.options[this.options.length - 1]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLString.sanitize(`
            CASE 
            ${this.whenClausesSQL()} 
            ${this.elseClauseSQL()}
            END ${this.asSQL()}
        `)
    }

    // Privates ---------------------------------------------------------------
    private whenClausesSQL(): string {
        return this.whenClauses.map(
            ([when, then]) => `
                WHEN ${this.whenSQL(when)} 
                THEN ${SQLString.value(then)}
            `
        )
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private elseClauseSQL(): string {
        return this.elseClause
            ? `ELSE ${SQLString.value(this.elseClause)}`
            : ''
    }

    // ------------------------------------------------------------------------

    private whenSQL(when: WhenQueryOption<T>): string {
        return Array.isArray(when)
            ? new OrSQLBuilder(this.target, when, this.alias).SQL()
            : new AndSQLBuilder(this.target, when, this.alias).SQL()
    }

    // ------------------------------------------------------------------------

    private asSQL(): string {
        return this.as ? `AS ${this.as}` : ''
    }
}

export {
    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
}