// QueryBuilders
import AndSQLBuilder, { type AndQueryOptions } from "../AndSQLBuilder"

// Types
import type { Entity, Constructor, TargetMetadata } from "../../../types"
import type { OrQueryOptions } from "./types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"

export default class OrSQLBuilder<T extends Entity> {
    private unionSQLBuilders: UnionSQLBuilder[] = []

    constructor(
        public target: Constructor<T>,
        public options: OrQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.options
            .map(option => `(${this.andSQL(option)})`)
            .join(' OR ')
    }

    // ------------------------------------------------------------------------

    public unions(): UnionSQLBuilder[] {
        return this.unionSQLBuilders
    }

    // Privates ---------------------------------------------------------------
    private andSQL(option: AndQueryOptions<T>): string {
        const and = new AndSQLBuilder(
            this.target, option, this.alias
        )
        this.unionSQLBuilders.push(...and.unions())

        return and.SQL()
    }
}

export {
    type OrQueryOptions
}