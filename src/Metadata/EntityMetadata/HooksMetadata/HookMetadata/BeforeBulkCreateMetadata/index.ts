import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { CreateAttributes } from "../../../../../SQLBuilders"

export default class BeforeBulkCreateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeBulkCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: CreateAttributes<any>[]) {
        return this.hookFn(attributes)
    }
}