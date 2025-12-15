// Query Builders
import ConditionalSQLBuilder, { Case } from "../ConditionalSQLBuilder"

// Helpers
import { SQLStringHelper, PropertySQLHelper } from "../../Helpers"

// Types
import type { Entity, Constructor } from "../../types"
import type {
    OrderQueryOptions,
    OrderQueryOption,
    OrderCaseOption
} from "./types"

export default class OrderSQLBuilder<T extends Entity> {
    constructor(
        public target: Constructor<T>,
        public options: OrderQueryOptions<T>,
        public alias: string = target.name.toLowerCase()
    ) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public SQL(): string {
        return SQLStringHelper.normalizeSQL(`ORDER BY ${(
            this.options.map(option => Array.isArray(option)
                ? this.orderSQL(option)
                : this.caseSQL(option)
            )
        )}`)
    }

    // Privates ---------------------------------------------------------------
    private orderSQL(option: OrderQueryOption<T>): string {
        return `${PropertySQLHelper.pathToAlias(option[0], this.alias)} ${(
            option[1]
        )}`
    }

    // ------------------------------------------------------------------------

    private caseSQL(option: OrderCaseOption<T>): string {
        return ConditionalSQLBuilder.case(
            this.target,
            option[Case],
            undefined,
            this.alias
        )
            .SQL()
    }
}

export {
    type OrderQueryOptions,
    type OrderQueryOption,
    type OrderCaseOption
}