import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"
import type { CreationAttributes } from "../../../../../SQLBuilders"

export default class BeforeCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-create' {
        return 'before-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        attributes: CreationAttributes<T>
    ) {
        return this.hookFn(attributes)
    }
}