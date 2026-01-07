import DataType from "./DataType"

export type BitLength = '8' | '16' | '24' | '32' | '40' | '48' | '56' | '64'

export default class BIT extends DataType {
    constructor(public length: BitLength = '8') {
        super('bit')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `BIT(${this.length})`
    }
}