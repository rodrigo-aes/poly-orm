import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { Entity } from "../../../../../types"

export default class AfterCreateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'afterCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: Entity): void | Promise<void> {
        return this.hookFn(result)
    }
}