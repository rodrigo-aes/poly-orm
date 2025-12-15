import HookMetadata from "../HookMetadata"

export default class AfterFindMetadata extends HookMetadata {
    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get type(): 'after-find' {
        return 'after-find'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public call(result: any): void | Promise<void> {
        return this.hookFn(result)
    }
}