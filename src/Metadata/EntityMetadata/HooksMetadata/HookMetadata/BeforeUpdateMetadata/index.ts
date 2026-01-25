import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type { Entity } from "../../../../../types"
import type {
    ConditionalQueryOptions,
    UpdateAttributes,
} from "../../../../../SQLBuilders"

export default class BeforeUpdateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeUpdate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(
        attributes: Entity | UpdateAttributes<any>,
        where?: ConditionalQueryOptions<any>
    ) {
        return this.hookFn(attributes, where)
    }
}