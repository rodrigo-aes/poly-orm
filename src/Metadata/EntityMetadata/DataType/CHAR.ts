import DataType from "./DataType"

export default class VARCHAR extends DataType {
    constructor(public length: number = 1) {
        super('char')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `CHAR(${this.length})`
    }
}