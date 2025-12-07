import HookMetadata from "../HookMetadata"
import type { Entity } from "../../../../../types"
import type { DeleteResult } from "../../../../../Handlers"

export default class AfterDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-delete' {
        return 'after-delete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(entity: T, result: DeleteResult) {
        return this.hookFn(entity, result)
    }
}