import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

export default class AfterBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterBulkCreate'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: any[]): void | Promise<void> {
        return this.hookFn(result)
    }
}