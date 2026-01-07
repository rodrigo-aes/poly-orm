import DataType from "./DataType"

export default class FLOAT extends DataType {
    constructor(
        public M?: number,
        public D?: number,
    ) {
        super('float')
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `FLOAT(${this.arguments()})`
    }

    // Privates ---------------------------------------------------------------
    private arguments() {
        let args = ''
        if (this.M) args += this.M.toString()
        if (this.D) args += `, ${this.D}`
    }
}