import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

import type { DeleteResult } from "../../../../../Handlers"
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class AfterBulkDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterBulkDelete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(
        where: ConditionalQueryOptions<any>,
        result: DeleteResult
    ) {
        return this.hookFn(where, result)
    }
}