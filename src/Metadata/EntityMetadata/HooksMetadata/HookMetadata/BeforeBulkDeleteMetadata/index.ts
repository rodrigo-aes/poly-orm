import HookMetadata from "../HookMetadata"

// Types
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeBulkDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-delete' {
        return 'before-bulk-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(where: ConditionalQueryOptions<any>) {
        return this.hookFn(where)
    }
}