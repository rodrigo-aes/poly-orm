import EntityMetadata from "../../.."
import ColumnMetadata from '..'

// Types
import type { EntityTarget } from "../../../../../types"
import type { RelatedEntitiesMap } from "../../../RelationsMetadata"

import type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    RelatedColumnsMap,

    ForeignKeyReferencesJSON
} from "./types"

export default class ForeignKeyReferences {
    public constrained: boolean = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: any

    public referenced!: ForeignKeyReferencedGetter

    private _entity?: EntityMetadata | RelatedEntitiesMap
    private _column?: ColumnMetadata | RelatedColumnsMap

    constructor(
        public target: EntityTarget,
        private parentName: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.target)
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get entity(): EntityMetadata | RelatedEntitiesMap {
        return this._entity = this._entity ?? this.handleEntity()
    }

    // ------------------------------------------------------------------------

    public get column(): ColumnMetadata | RelatedColumnsMap {
        return this._column = this._column ?? this.handleColumn()
    }

    // ------------------------------------------------------------------------

    public get name(): string | undefined {
        if (this.constrained) return `fk_${this.tableName}_${this.parentName}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): ForeignKeyReferencesJSON {
        return {
            entity: this.entityToJSON(),
            column: this.columnToJSON(),
            name: this.name,
            constrained: this.constrained,
            onDelete: this.onDelete,
            onUpdate: this.onUpdate,
            scope: this.scope,
        }
    }

    // Privates ---------------------------------------------------------------
    private handleEntity(): EntityMetadata | RelatedEntitiesMap {
        const referenced = this.referenced()
        return Array.isArray(referenced)
            ? Object.fromEntries(referenced.map(
                ref => [ref.name, EntityMetadata.findOrBuild(ref)]
            ))
            : EntityMetadata.findOrBuild(referenced)
    }

    // ------------------------------------------------------------------------

    private handleColumn(): ColumnMetadata | RelatedColumnsMap {
        return this.entity instanceof EntityMetadata
            ? this.entity.columns.primary
            : Object.fromEntries(Object.entries(this.entity).map(
                ([name, entity]) => [name, entity.columns.primary]
            )) as RelatedColumnsMap
    }

    // ------------------------------------------------------------------------

    private entityToJSON() {
        return this.entity instanceof EntityMetadata
            ? this.entity.toJSON()
            : Object.fromEntries(Object.entries(this.entity).map(
                ([key, entity]) => [key, entity.toJSON()]
            ))
    }

    // ------------------------------------------------------------------------

    private columnToJSON() {
        return this.column instanceof ColumnMetadata
            ? this.column.toJSON()
            : Object.fromEntries(Object.entries(this.column).map(
                ([key, column]) => [key, column.toJSON()]
            ))
    }
}

export type {
    ForeignKeyReferencesInitMap,
    ForeignKeyReferencedGetter,
    ForeignKeyActionListener,
    ForeignKeyReferencesJSON
}