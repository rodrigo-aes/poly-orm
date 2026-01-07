import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { Entity } from "../../../../../types"

export default class BeforeDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'beforeDelete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(entity: Entity) {
        return this.hookFn(entity)
    }
}