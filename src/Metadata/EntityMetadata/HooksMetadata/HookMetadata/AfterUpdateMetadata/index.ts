import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

import type { Entity } from "../../../../../types"

export default class AfterUpdateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'afterUpdate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(entity: Entity) {
        return this.hookFn(entity)
    }
}