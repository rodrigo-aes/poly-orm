import HookMetadata from "../HookMetadata"

import type { DeleteResult } from "../../../../../Handlers"
import type { Entity } from "../../../../../types"
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class AfterBulkDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-bulk-delete' {
        return 'after-bulk-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        where: ConditionalQueryOptions<T>,
        result: DeleteResult
    ) {
        return this.hookFn(where, result)
    }
}