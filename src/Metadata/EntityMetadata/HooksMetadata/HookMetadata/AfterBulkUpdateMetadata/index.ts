import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

import type { ResultSetHeader } from "mysql2"
import type { Entity } from "../../../../../types"
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class AfterBulkUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterBulkUpdate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        where: ConditionalQueryOptions<T> | undefined,
        result: ResultSetHeader
    ) {
        return this.hookFn(where, result)
    }
}