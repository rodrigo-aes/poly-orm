import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"

export default class BeforeDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-delete' {
        return 'before-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(entity: Entity) {
        return this.hookFn(entity)
    }
}