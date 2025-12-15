import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindSQLBuilder } from "../../../../SQLBuilders"
import type { CollectMapOptions } from "../types"
import type { FindResult } from "./types"

export default class FindOperation<
    T extends Entity,
    M extends CollectMapOptions<T>
> extends OperationHandler<T, FindSQLBuilder<T>, M> {
    public readonly fillMethod = 'Many'

    @Hooks.BulkFind
    public exec(): Promise<FindResult<T, M>> {
        return this.execMappedQuery()
    }
}

export type {
    FindResult
}
