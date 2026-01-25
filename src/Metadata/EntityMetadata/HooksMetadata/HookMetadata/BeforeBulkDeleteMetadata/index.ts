import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { ConditionalQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeBulkDeleteMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeBulkDelete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(where: ConditionalQueryOptions<any>) {
        return this.hookFn(where)
    }
}