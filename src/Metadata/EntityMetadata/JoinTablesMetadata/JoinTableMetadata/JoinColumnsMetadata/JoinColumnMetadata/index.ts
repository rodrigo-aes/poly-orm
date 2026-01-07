import JoinForeignKeyReferences from "./JoinForeignKeyReferences"

import type JoinTableMetadata from "../.."
import type DataType from "../../../../DataType"
import type { JoinColumnInitMap, JoinColumnMetadataJSON } from "./types"

export default class JoinColumnMetadata {
    public readonly isForeignKey = true
    public references: JoinForeignKeyReferences

    constructor(
        private table: JoinTableMetadata,
        initMap: JoinColumnInitMap
    ) {
        this.references = this.makeReferences(initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get tableName(): string {
        return this.table.name
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return `${this.references.entity.name.toLowerCase()}Id`
    }

    // ------------------------------------------------------------------------

    public get dataType(): DataType {
        return this.references.column.dataType
    }

    // ------------------------------------------------------------------------

    public get length(): number | undefined {
        return this.references.column.length
    }

    // ------------------------------------------------------------------------

    public get unsigned(): boolean | undefined {
        return this.references.column.unsigned
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): JoinColumnMetadataJSON {
        return {
            name: this.name,
            dataType: this.dataType.toJSON(),
            length: this.length,
            unsigned: this.unsigned,
            isForeignKey: this.isForeignKey,
            references: this.references.toJSON(),
        }
    }

    // Privates ---------------------------------------------------------------
    private makeReferences(initMap: JoinColumnInitMap) {
        return new JoinForeignKeyReferences(this.table, initMap)
    }
}

export type {
    JoinColumnInitMap,
    JoinColumnMetadataJSON
}