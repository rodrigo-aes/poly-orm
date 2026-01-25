import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

export default class BeforeSyncMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'beforeSync'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(): void | Promise<void> {
        return this.hookFn()
    }
}