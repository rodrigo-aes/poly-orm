import HookMetadata from "../HookMetadata"

export default class AfterBulkCreateMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-bulk-create' {
        return 'after-bulk-create'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: any[]): void | Promise<void> {
        return this.hookFn(result)
    }
}