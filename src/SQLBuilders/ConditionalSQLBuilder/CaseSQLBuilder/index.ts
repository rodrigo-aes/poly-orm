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

    private _else?: ElseQueryOption

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
    public get whens(): CaseQueryTuple<T>[] {
        return this.else ? this.options : this.options.slice(0, -1)
    }

    // ------------------------------------------------------------------------

    public get else(): ElseQueryOption | undefined {
        return this._else ??= (
            Array.isArray(this.lastOption) ? undefined : this.lastOption
        )
    }

    // Privates ---------------------------------------------------------------
    private get lastOption(): CaseQueryTuple<T> | ElseQueryOption {
        return this.options[this.options.length - 1]
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return `CASE ${this.whenClausesSQL()}${this.elseClauseSQL()} END${(
            this.asSQL()
        )}`
    }

    // Privates ---------------------------------------------------------------
    private whenClausesSQL(): string {
        return this.whens
            .map(([when, then]) => `WHEN ${this.whenSQL(when)} THEN ${(
                SQLString.value(then)
            )}`)
            .join(' ')
    }

    // ------------------------------------------------------------------------

    private elseClauseSQL(): string {
        return this.else
            ? ` ELSE ${SQLString.value(this.else)}`
            : ''
    }

    // ------------------------------------------------------------------------

    private whenSQL(when: WhenQueryOption<T>): string {
        return new (Array.isArray(when) ? OrSQLBuilder : AndSQLBuilder)(
            this.target,
            when as any,
            this.alias
        )
            .SQL()
    }

    // ------------------------------------------------------------------------

    private asSQL(): string {
        return this.as ? ` AS ${this.as}` : ''
    }
}

export {
    Case,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
}