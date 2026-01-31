import type { DecoratorFn } from "./types"

export default class DecoratorMeta {
    protected cols: DecoratorFn[] = []
    protected relations: DecoratorFn[] = []
    protected hooks: DecoratorFn[] = []

    // Getters ================================================================
    // Protecteds ---------------------------------------------------------------
    protected get all(): DecoratorFn[] {
        return this.cols.concat(this.relations, this.hooks)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public register(target: Object) {
        for (const fn of this.all) fn(target)
    }

    // ------------------------------------------------------------------------

    public col = this.cols.push

    // ------------------------------------------------------------------------

    public rel = this.relations.push

    // ------------------------------------------------------------------------

    public hook = this.hooks.push

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static define(metadata: any): DecoratorMeta {
        return (metadata.entity ??= new DecoratorMeta())
    }
}