import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

export default class AfterSyncMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): HookType {
        return 'afterSync'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(): void | Promise<void> {
        return this.hookFn()
    }
}