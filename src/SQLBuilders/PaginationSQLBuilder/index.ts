import FindSQLBuilder from "../FindSQLBuilder"

// Types
import type { Entity, Constructor } from "../../types"
import type { PaginationQueryOptions } from "./types"

export default class PaginationSQLBuilder<
    T extends Entity
> extends FindSQLBuilder<T> {
    public page: number = 1
    public perPage: number = 26

    constructor(
        target: Constructor<T>,
        options: PaginationQueryOptions<T>,
        alias?: string
    ) {
        super(target, options, alias)

        if (options.page) this.page = options.page
        if (options.perPage) this.perPage = options.perPage

        this.limit = this.perPage
        this.offset = (this.page - 1) * this.perPage
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public totalSQL(): string {
        return `SELECT COUNT(*) AS \`total\` FROM \`${(
            this.metadata.tableName
        )}\``
    }
}

export {
    type PaginationQueryOptions
}