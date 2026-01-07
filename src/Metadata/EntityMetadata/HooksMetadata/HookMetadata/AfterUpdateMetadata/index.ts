import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

import type { Entity } from "../../../../../types"

export default class AfterUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterUpdate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(entity: Entity) {
        return this.hookFn(entity)
    }
}