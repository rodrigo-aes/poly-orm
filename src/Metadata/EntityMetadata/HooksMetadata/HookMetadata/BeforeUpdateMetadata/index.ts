import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"
import type {
    ConditionalQueryOptions,
    UpdateAttributes,
} from "../../../../../SQLBuilders"

export default class BeforeUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-update' {
        return 'before-update'
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