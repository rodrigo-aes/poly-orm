import HookMetadata from "../HookMetadata"
import type { HookType } from "../types"

export default class AfterFindMetadata extends HookMetadata {
    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get type(): HookType {
        return 'afterFind'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: any): void | Promise<void> {
        return this.hookFn(result)
    }
}