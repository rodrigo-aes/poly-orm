import FindOneSQLBuilder from "../FindOneSQLBuilder"

// SQL Builders
import OrderSQLBuilder from "../OrderSQLBuilder"

// Helpers
import { SQLStringHelper } from "../../Helpers"

// Types
import type { Target } from "../../types"
import type { FindQueryOptions } from "./types"

export default class FindSQLBuilder<
    T extends Target
> extends FindOneSQLBuilder<T> {
    public order?: OrderSQLBuilder<T>
    public limit?: number
    public offset?: number

    constructor(
        public target: T,
        public options: FindQueryOptions<InstanceType<T>> = {},
        alias?: string,
        isMain: boolean = true
    ) {
        super(target, options, alias, isMain, 'find')

        this.order = this.buildOrder()
        this.limit = options.limit
        this.offset = options.offset
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override SQL(): string {
        return SQLStringHelper.normalizeSQL(
            [
                this.isMain ? this.unionsSQL() : '',
                this.selectSQL(),
                this.joinsSQL(),
                this.whereSQL(),
                this.groupSQL(),
                this.orderSQL(),
                this.limitSQL(),
                this.offsetSQL(),
            ]
                .join(' ')
        )
    }

    // ------------------------------------------------------------------------

    public orderSQL(): string {
        return this.order?.SQL() ?? ''
    }

    // ------------------------------------------------------------------------

    public override limitSQL(): string {
        return this.limit ? `LIMIT ${this.limit}` : ''
    }

    // ------------------------------------------------------------------------

    public offsetSQL(): string {
        return this.offset ? `OFFSET ${this.offset}` : ''
    }

    // Privates ---------------------------------------------------------------
    private buildOrder(): OrderSQLBuilder<T> | undefined {
        if (this.options.order) return new OrderSQLBuilder(
            this.target,
            this.options.order,
            this.alias
        )

    }
}

export {
    type FindQueryOptions
}