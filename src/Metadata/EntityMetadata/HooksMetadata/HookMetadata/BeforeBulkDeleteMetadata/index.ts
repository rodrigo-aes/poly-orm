import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeBulkDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-delete' {
        return 'before-bulk-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        where: ConditionalQueryOptions<T>
    ) {
        return this.hookFn(where)
    }
}