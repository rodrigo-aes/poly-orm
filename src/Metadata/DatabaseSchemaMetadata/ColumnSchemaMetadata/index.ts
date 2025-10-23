import type { ColumnSchema } from "../../../DatabaseSchema"
import type { ColumnSchemaMetadataMap } from "./types"

class ColumnSchemaMetadata extends WeakMap<
    ColumnSchema, ColumnSchemaMetadataMap
> {
    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getPolymorphicPrefix(schema: ColumnSchema): string {
        return this.get(schema)!.polymorphicPrefix! ?? (
            () => { throw new Error }
        )()
    }

    // ------------------------------------------------------------------------

    public setPolymorphicPrefix(schema: ColumnSchema, prefix: string): this {
        return this.set(schema, {
            ...this.get(schema),
            polymorphicPrefix: prefix
        })
    }
}

export default new ColumnSchemaMetadata