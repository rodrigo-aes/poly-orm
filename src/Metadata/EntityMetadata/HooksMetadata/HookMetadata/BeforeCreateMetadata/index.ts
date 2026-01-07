import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'beforeCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: CreationAttributes<any>) {
        return this.hookFn(attributes)
    }
}