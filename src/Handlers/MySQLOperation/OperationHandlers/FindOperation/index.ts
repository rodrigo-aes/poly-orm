import OperationHandler from "../OperationHandler"
import Hooks from "../../Hooks"

// Types
import type { Entity } from "../../../../types"
import type { FindSQLBuilder } from "../../../../SQLBuilders"
import type { CollectMapOptions, ExecOptions } from "../types"
import type { FindResult } from "./types"

export default class FindOperation extends OperationHandler {
    public static readonly fillMethod = 'Many'

    @Hooks.BulkFind
    public static exec<
        T extends Entity,
        B extends FindSQLBuilder<T>,
        M extends CollectMapOptions<T>
    >(options: ExecOptions<T, B, M>): Promise<FindResult<T, M>> {
        return this.execMappedQuery(options)
    }
}

export type {
    FindResult
}
