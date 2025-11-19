import HookMetadata from "../HookMetadata"

// Types
import type { BaseEntity } from "../../../../../Entities"
import type { BasePolymorphicEntity } from "../../../../../Entities"
import type {
    RawData,
    MySQL2RawData
} from "../../../../../Handlers/MySQL2RawDataHandler"

export default class AfterBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-bulk-create' {
        return 'after-bulk-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call<T extends (
        (BaseEntity | BasePolymorphicEntity<any>) |
        RawData<any> |
        MySQL2RawData
    )>(result: T[]): void | Promise<void> {
        return this.hookFn(result)
    }
}