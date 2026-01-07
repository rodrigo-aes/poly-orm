// Types
import type { Entity, Constructor } from "../../types"

import type { GroupQueryOptions } from "../../SQLBuilders"

/** @internal */
export default class GroupQueryBuilder<T extends Entity> {
    private options: GroupQueryOptions<T> = []

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public groupBy(...columns: GroupQueryOptions<T>): this {
        this.options.push(...columns)
        return this
    }

    // ------------------------------------------------------------------------

    public toQueryOptions(): GroupQueryOptions<T> {
        return this.options
    }
}