import DataType from "./DataType"

export default class BINARY extends DataType {
    constructor(public length: number = 64) {
        super('binary')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `BINARY(${this.length})`
    }
}