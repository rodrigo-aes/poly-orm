import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"
import { MetadataHandler } from "../../../../Metadata"

// Types
import type { Constructor, Entity } from "../../../../types"
import type { PaginationSQLBuilder } from "../../../../SQLBuilders"
import type { PaginationInitMap } from "../../../../Entities"
import type { ExecOptions, PaginateMapOptions } from "../types"
import type { PaginateResult } from "./types"

export default class PaginateOperation extends OperationHandler {
    public readonly fillMethod = 'Many'

    @Hooks.BulkFind
    public static async exec<
        T extends Entity,
        M extends PaginateMapOptions<T>
    >(options: ExecOptions<T, PaginationSQLBuilder<T>, M>): Promise<
        PaginateResult<T, M>
    > {
        return this.execAndMap({
            ...options,
            pagination: await this.initMap(options.target, options.sqlBuilder)
        })
    }

    // Privates ---------------------------------------------------------------
    private static async initMap<
        T extends Entity,
        B extends PaginationSQLBuilder<T>
    >(target: Constructor<T>, sqlBuilder: B): Promise<PaginationInitMap> {
        return {
            page: sqlBuilder.page,
            perPage: sqlBuilder.perPage,
            total: await this.execTotalQuery(target, sqlBuilder)
        }
    }

    // ------------------------------------------------------------------------

    private static async execTotalQuery<
        T extends Entity,
        B extends PaginationSQLBuilder<T>
    >(target: Constructor<T>, sqlBuilder: B): Promise<number> {
        return (await MetadataHandler
            .targetMetadata(target)
            .connection
            .query(sqlBuilder.totalSQL())
        )[0].total
    }
}

export type {
    PaginateResult
}