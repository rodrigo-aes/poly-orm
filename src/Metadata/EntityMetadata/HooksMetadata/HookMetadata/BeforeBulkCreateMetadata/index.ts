import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'beforeBulkCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: CreationAttributes<any>[]) {
        return this.hookFn(attributes)
    }
}