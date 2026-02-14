import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { CreateAttributes } from "../../../../../SQLBuilders"

export default class BeforeCreateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: CreateAttributes<any>) {
        return this.hookFn(attributes)
    }
}