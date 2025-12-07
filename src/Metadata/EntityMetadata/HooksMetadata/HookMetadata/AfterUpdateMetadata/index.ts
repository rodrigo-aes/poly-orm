import HookMetadata from "../HookMetadata"
import type { Entity } from "../../../../../types"

export default class AfterUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-update' {
        return 'after-update'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(entity: T) {
        return this.hookFn(entity)
    }
}