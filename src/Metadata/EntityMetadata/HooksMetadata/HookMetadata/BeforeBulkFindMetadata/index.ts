import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { FindQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeBulkFindMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'beforeBulkFind'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(options: FindQueryOptions<any>): void | Promise<void> {
        return this.hookFn(options)
    }
}