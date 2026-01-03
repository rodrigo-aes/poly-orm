// SQL Builder
import ExistsSQLBuilder, { Exists } from '../ExistsSQLBuilder'

// Handlers
import { SQLString } from '../../../Handlers'

// Types
import type { Entity, Constructor } from "../../../types"
import type UnionSQLBuilder from "../../UnionSQLBuilder"
import type { AndQueryOptions } from "./types"

export default class AndSQLBuilder<T extends Entity> {
    constructor(
        public target: Constructor<T>,
        public options: AndQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) { }

    public get unions(): UnionSQLBuilder[] {
        return []
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return this.conditionalsSQL() + this.conditionalExistsSQL()
    }

    // Privates ---------------------------------------------------------------
    private conditionalsSQL(): string {
        return Object
            .entries(this.options)
            .map(([key, value]) => SQLString.cond(
                this.target,
                key,
                value,
                this.alias
            ))
            .join(' AND ')
    }

    // ------------------------------------------------------------------------

    private conditionalExistsSQL(): string {
        return this.options[Exists]
            ? ' AND' + new ExistsSQLBuilder(
                this.target,
                this.options[Exists],
                this.alias
            )
                .SQL()
            : ''
    }
}

export {
    type AndQueryOptions
}