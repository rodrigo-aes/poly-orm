import type { SQLColumnType } from "../ColumnsMetadata/ColumnMetadata"
import type { DataTypeMetadataJSON } from "./types"
export default abstract class DataType {
    protected constructor(public type: SQLColumnType) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public buildSQL(): string {
        return this.type.toUpperCase()
    }

    // ------------------------------------------------------------------------

    public toJSON(): DataTypeMetadataJSON {
        return this.type
    }
}