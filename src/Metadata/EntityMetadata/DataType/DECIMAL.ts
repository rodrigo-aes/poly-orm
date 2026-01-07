import DataType from "./DataType"

export default class DECIMAL extends DataType {
    constructor(
        public M: number = 10,
        public D: number = 0,
    ) {
        super('decimal')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `DECIMAL(${this.M}, ${this.D})`
    }
}