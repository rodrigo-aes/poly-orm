import DataType from "./DataType"

export default class DOUBLE extends DataType {
    constructor(
        public M?: number,
        public D?: number,
    ) {
        super('double')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `DOUBLE(${this.arguments()})`
    }

    // Privates ---------------------------------------------------------------
    private arguments() {
        let args = ''
        if (this.M) args += this.M.toString()
        if (this.D) args += `, ${this.D}`
    }
}