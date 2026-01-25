import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

// Types
import type {
    ConditionalQueryOptions,
    UpdateAttributes,
} from "../../../../../SQLBuilders"

export default class BeforeBulkUpdateMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeBulkUpdate'
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