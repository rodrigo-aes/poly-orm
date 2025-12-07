import HookMetadata from "../HookMetadata"
import type { Entity } from "../../../../../types"

export default class BeforeDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-delete' {
        return 'before-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(entity: T) {
        return this.hookFn(entity)
    }
}