import { MetadataHandler } from "../../Metadata"

// Query Handlers
import ConditionalQueryBuilder from "../ConditionalQueryBuilder"

// Types
import type { Constructor, Entity, TargetMetadata } from "../../types"
import type { CaseQueryOptions, ElseQueryOption } from "../../SQLBuilders"
import type { CaseQueryTuple } from "./types"
import type { ConditionalQueryHandler } from "../types"

/**
 * Build a `CASE` conditional options
 */
export default class CaseQueryBuilder<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<Constructor<T>>

    /** @internal */
    private _whens!: CaseQueryTuple<T>[]

    /** @internal */
    private _else?: ElseQueryOption

    /** @internal */
    public _as?: string

    /** @internal */
    constructor(
        /** @internal */
        public target: Constructor<T>,

        /** @internal */
        public alias?: string
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Add a CASE WHEN clause and THEN value
     * @param caseClause - Where query handler to define WHEN caluse
     * @param then - THEN value
     * @returns {this} - `this`
     */
    public when(caseClause: ConditionalQueryHandler<T>, then: any): this {
        const where = new ConditionalQueryBuilder(
            this.target,
            this.alias
        )

        caseClause(where)

        const tuple: CaseQueryTuple<T> = [where, then]

        if (this._whens) this._whens.push(tuple)
        else this._whens = [tuple]

        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Add a ELSE fallback clause case all WHENs clauses not matched
     * @param value - ELSE value
     * @returns {this} - `this`
     */
    public else(value: any): Omit<this, 'when'> {
        this._else = value
        return this
    }

    // ------------------------------------------------------------------------

    /**
     * Define a AS alias to conditional result
     * @param name - Alias/Name
     */
    public as(name: string): void {
        this._as = name
    }

    // ------------------------------------------------------------------------

    /**
     * Convert `this` to `CaseQueryOptions` object
     * @returns - A object with case options
     */
    public toQueryOptions(): CaseQueryOptions<T> {
        return [
            ...this._whens.map(([when, then]) => [
                when.toQueryOptions(),
                then
            ]),
            this._else
        ] as CaseQueryOptions<T>
    }
}