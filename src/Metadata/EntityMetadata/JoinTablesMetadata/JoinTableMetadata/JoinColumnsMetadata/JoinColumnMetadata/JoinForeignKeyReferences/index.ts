import EntityMetadata from "../../../../.."

import type JoinTableMetadata from "../../.."
import type JoinColumnMetadata from ".."
import type { ColumnMetadata } from "../../../../../ColumnsMetadata"

import type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesInitMap,
    JoinForeignKeyReferencesJSON
} from "./types"

export default class JoinForeignKeyReferences {
    public readonly constrained = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener

    referenced!: JoinForeignKeyReferencedGetter

    constructor(
        private table: JoinTableMetadata,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get entity(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.referenced())
    }

    // ------------------------------------------------------------------------

    public get column(): ColumnMetadata {
        return this.entity.columns.primary
    }

    // ------------------------------------------------------------------------

    public get name(): string {
        return `fk_${this.table.name}_${this.entity.name.toLowerCase()}Id`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): JoinForeignKeyReferencesJSON {
        return {
            entity: this.entity.toJSON(),
            column: this.column.toJSON(),
            name: this.name,
            constrained: this.constrained,
            onDelete: this.onDelete,
            onUpdate: this.onUpdate,
        }
    }
}

export type {
    JoinForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesInitMap,
    JoinForeignKeyReferencesJSON
}