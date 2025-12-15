import HookMetadata from "../HookMetadata"

// Types
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-create' {
        return 'before-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(attributes: CreationAttributes<any>) {
        return this.hookFn(attributes)
    }
}