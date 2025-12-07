import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-create' {
        return 'before-bulk-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        attributes: CreationAttributes<T>[]
    ) {
        return this.hookFn(attributes)
    }
}