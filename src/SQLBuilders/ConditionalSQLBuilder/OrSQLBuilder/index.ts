// QueryBuilders
import AndSQLBuilder, { type AndQueryOptions } from "../AndSQLBuilder"

// Types
import type { Entity, Constructor } from "../../../types"
import type { OrQueryOptions } from "./types"

export default class OrSQLBuilder<T extends Entity> {
    constructor(
        public target: Constructor<T>,
        public options: OrQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.options
            .map(option => `(${(
                new AndSQLBuilder(this.target, option, this.alias).SQL()
            )})`)
            .join(' OR ')
    }
}

export {
    type OrQueryOptions
}