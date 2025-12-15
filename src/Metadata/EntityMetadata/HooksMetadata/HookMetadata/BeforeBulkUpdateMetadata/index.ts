import HookMetadata from "../HookMetadata"

// Types
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
    public call(
        attributes: UpdateAttributes<any>,
        where?: ConditionalQueryOptions<any>
    ) {
        return this.hookFn(attributes, where)
    }
}