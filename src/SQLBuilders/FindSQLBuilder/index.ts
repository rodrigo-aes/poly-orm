import FindOneSQLBuilder from "../FindOneSQLBuilder"

// SQL Builders
import OrderSQLBuilder from "../OrderSQLBuilder"

// Handlers
import { SQLString } from "../../Handlers"

// Types
import type { Entity, Constructor } from "../../types"
import type { FindQueryOptions } from "./types"

export default class FindSQLBuilder<
    T extends Entity
> extends FindOneSQLBuilder<T> {
    public order?: OrderSQLBuilder<T>
    public limit?: number
    public offset?: number

    constructor(
        public target: Constructor<T>,
        public options: FindQueryOptions<T> = {},
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
        return SQLString.sanitize(
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