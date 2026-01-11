import { li, type LiteralHandler } from "../../../../SQLBuilders"

export default class CheckConstraintSchema extends Array<string> {
    /** @internal */
    constructor(
        public tableName: string,
        public columnName: string,
        ...constraints: (string | LiteralHandler)[]
    ) {
        super(...CheckConstraintSchema.resolveConstraints(...constraints))
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return `chk_${this.tableName}_${this.columnName}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public check(...constraints: (string | LiteralHandler)[]): this {
        this.push(...CheckConstraintSchema.resolveConstraints(...constraints))
        return this
    }

    // Static Methods =========================================================
    // Privates ---------------------------------------------------------------
    private static resolveConstraints(...constraints: (
        string | LiteralHandler
    )[]): string[] {
        return constraints.map(constraint => {
            switch (typeof constraint) {
                case "string": return constraint
                case "function": return constraint(li)
            }
        })
    }
}