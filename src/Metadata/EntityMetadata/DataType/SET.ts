import DataType from "./DataType"

export default class SET extends DataType {
    public options: string[]

    constructor(...options: string[]) {
        super('set')
        this.options = options
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public override buildSQL(): string {
        return `SET(${this.buildOptions()})`
    }

    // Privates ---------------------------------------------------------------
    private buildOptions(): string {
        return this.options.map(option => `'${option}'`).join(',')
    }
}