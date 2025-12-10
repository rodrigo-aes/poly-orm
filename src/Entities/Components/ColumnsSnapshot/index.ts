// Types
import type { Entity } from "../../../types"

class ColumnsSnapshots extends WeakMap<object, any> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public columnChanged(entity: object, column: string, value: any): boolean {
        return this.get(entity)[column] !== value
    }

    // ------------------------------------------------------------------------

    public shouldUpdate(entity: Entity): boolean {
        return Object.entries(this.get(entity)).some(
            ([column, value]) => entity[column as keyof object] !== value
        )
    }

    // ------------------------------------------------------------------------

    public changed(entity: Entity): any {
        return Object.entries(this.get(entity)).flatMap(
            ([column, value]) => entity[column as keyof object] !== value
                ? [[column, entity[column as keyof object]]]
                : []
        )
    }
}

export default new ColumnsSnapshots