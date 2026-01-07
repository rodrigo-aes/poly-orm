import {
    type OrderQueryOptions as SQLBuilderQueryOptions
} from "../../SQLBuilders"

// Query Builders
import CaseQueryBuilder from "../CaseQueryBuilder"

// Symbols
import { Case } from "../../SQLBuilders"

// Types
import type { Entity, Constructor } from "../../types"
import type { OrderQueryOptions } from "./types"

/** @internal */
export default class OrderQueryBuilder<T extends Entity> {
    private _options: SQLBuilderQueryOptions<T> = []

    constructor(
        public target: Constructor<T>,
        public alias?: string
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public orderBy(...options: OrderQueryOptions<T>): this {
        for (const option of options) switch (typeof option) {
            case "object": this._options.push(option)
                break

            // ----------------------------------------------------------------

            case "function": this._options.push({
                [Case]: new CaseQueryBuilder(this.target, this.alias)
                    .handle(option)
                    .toQueryOptions()
            })
        }

        return this
    }

    // -----------------------------------------------------------------------

    public toQueryOptions(): SQLBuilderQueryOptions<T> {
        return this._options
    }
}

export {
    type OrderQueryOptions
}