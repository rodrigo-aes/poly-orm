import FindSQLBuilder, { type FindQueryOptions } from "../FindSQLBuilder"

// Query Builders
import CountSQLBuilder from "../CountSQLBuilder"

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
        const { page, perPage, ...opts } = options

        super(target, opts, alias)

        if (page) this.page = page
        if (perPage) this.perPage = perPage

        this.setLimit()
        this.setOffset()
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public totalSQL(): string {
        return `SELECT COUNT(*) AS total FROM ${this.metadata.tableName}`
    }

    // Privates ---------------------------------------------------------------
    private setLimit(): void {
        this.limit = this.perPage
    }

    private setOffset(): void {
        this.offset = (this.page - 1) * this.perPage
    }
}

export {
    type PaginationQueryOptions
}