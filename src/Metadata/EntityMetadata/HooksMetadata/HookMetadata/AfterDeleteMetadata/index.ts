import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

import type { Entity } from "../../../../../types"
import type { DeleteResult } from "../../../../../Handlers"

export default class AfterDeleteMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterDelete'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(entity: Entity, result: DeleteResult) {
        return this.hookFn(entity, result)
    }
}