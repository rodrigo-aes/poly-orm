import JoinColumnMetadata, {
    type JoinColumnInitMap
} from "./JoinColumnMetadata"

import type JoinTableMetadata from ".."
import type { EntityTarget } from "../../../../../types"

import type { JoinColumnsMetadataJSON } from "./types"

// Exceptions
import PolyORMException from "../../../../../Errors"

export default class JoinColumnsMetadata extends Array<JoinColumnMetadata> {
    constructor(
        private table: JoinTableMetadata,
        ...columns: JoinColumnMetadata[]
    ) {
        super(...columns)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get [Symbol.species](): typeof Array {
        return Array
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public registerColumn(initMap: JoinColumnInitMap): void {
        this.push(new JoinColumnMetadata(this.table, initMap))
    }

    // ------------------------------------------------------------------------

    public search(columnName: string): JoinColumnMetadata | undefined {
        return this.find(({ name }) => name === columnName)
    }

    // ------------------------------------------------------------------------

    public findOrThrow(name: string): JoinColumnMetadata {
        return this.search(name)! ?? PolyORMException.Metadata.throw(
            'UNKNOWN_RELATION',
            'No connection',
            'No SQL operation',
            name,
            this.table.name
        )
    }

    // ------------------------------------------------------------------------

    public getTargetColumn(target: EntityTarget): JoinColumnMetadata {
        return this.findOrThrow(`${target.name.toLowerCase()}Id`)
    }

    // ------------------------------------------------------------------------

    public toJSON(): JoinColumnsMetadataJSON {
        return this.map(column => column.toJSON())
    }
}

export {
    JoinColumnMetadata,
    type JoinColumnInitMap,
    type JoinColumnsMetadataJSON
}