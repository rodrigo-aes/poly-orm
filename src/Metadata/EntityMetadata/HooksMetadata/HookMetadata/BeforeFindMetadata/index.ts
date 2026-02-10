import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { FindQueryOptions } from "../../../../../SQLBuilders"

export default class BeforeFindMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeFind'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(options?: FindQueryOptions<any>): void | Promise<void> {
        return this.hookFn(options)
    }
}