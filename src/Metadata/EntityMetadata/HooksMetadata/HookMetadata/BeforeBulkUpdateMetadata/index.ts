import HookMetadata from "../HookMetadata"

// Types
import type { Entity } from "../../../../../types"
import type {
    ConditionalQueryOptions,
    UpdateAttributes,
} from "../../../../../SQLBuilders"

export default class BeforeBulkUpdateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'before-bulk-update' {
        return 'before-bulk-update'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends Entity>(
        attributes: UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>
    ) {
        return this.hookFn(attributes, where)
    }
}