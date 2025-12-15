import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { PaginationSQLBuilder } from "../../../../SQLBuilders"
import type {
    Pagination,
    PaginationInitMap
} from "../../../../Entities"

export default class PaginateOperation<
    T extends Entity
> extends OperationHandler<T, PaginationSQLBuilder<T>, any> {
    public readonly fillMethod = 'Many'

    @Hooks.BulkFind
    public exec(): Promise<Pagination<T>> {
        return this.execMappedQuery()
    }

    // Protecteds -------------------------------------------------------------
    protected override async execMappedQuery(): Promise<Pagination<T>> {
        return this.map(
            await super.execMappedQuery(),
            await this.paginationInitMap()
        )
    }

    // Privates ---------------------------------------------------------------
    private async execTotalQuery(): Promise<number> {
        return (await this.connection.query(this.sqlBuilder.totalSQL()))
        [0].total
    }

    // ------------------------------------------------------------------------

    private async paginationInitMap(): Promise<PaginationInitMap> {
        return {
            page: this.sqlBuilder.page,
            perPage: this.sqlBuilder.perPage,
            total: await this.execTotalQuery()
        }
    }
}