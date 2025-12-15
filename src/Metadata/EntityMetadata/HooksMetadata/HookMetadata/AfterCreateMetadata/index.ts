import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"

export default class AfterCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-create' {
        return 'after-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: Entity): void | Promise<void> {
        return this.hookFn(result)
    }
}