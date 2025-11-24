class ColumnsSnapshots extends WeakMap<object, any> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public columnChanged(entity: object, column: string, value: any): boolean {
        return this.get(entity)[column] !== value
    }

    // ------------------------------------------------------------------------

    public changed(entity: object): any {
        return Object.fromEntries(Object.entries(this.get(entity)).flatMap(
            ([column, value]) =>
                entity[column as keyof object] !== value
                    ? [[column, entity[column as keyof object]]]
                    : []
        ))
    }
}

export default new ColumnsSnapshots