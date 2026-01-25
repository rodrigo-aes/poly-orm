import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

export default class AfterBulkFindMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'afterBulkFind'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: any[]): void | Promise<void> {
        return this.hookFn(result)
    }
}