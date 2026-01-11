import PolymorphicEntityMetadata from "../../.."
import EntityMetadata from "../../../../EntityMetadata"

import type { PolymorphicEntityTarget } from "../../../../../types"

import type {
    ForeignKeyActionListener,
    ForeignKeyReferencedGetter,
} from "../../../../EntityMetadata"

import type {
    ForeignKeyReferencesInitMap
} from "../../../../EntityMetadata/ColumnsMetadata"

import {
    ColumnMetadata,
    type ForeignKeyReferencesJSON,
} from "../../../../EntityMetadata"

import type {
    RelatedEntitiesMap
} from "../../../../EntityMetadata/RelationsMetadata"

import type {
    RelatedColumnsMap
} from "../../../../EntityMetadata/ColumnsMetadata/ColumnMetadata/ForeignKeyRef/types"

export default class PolymorphicForeignKeyReferences {
    public constrained: boolean = true
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: any

    public referenced!: ForeignKeyReferencedGetter

    private _entity?: EntityMetadata | RelatedEntitiesMap
    private _column?: ColumnMetadata | RelatedColumnsMap

    constructor(
        public target: PolymorphicEntityTarget,
        initMap: ForeignKeyReferencesInitMap
    ) {
        Object.assign(this, initMap)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get targetMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.find(this.target)!
    }

    // ------------------------------------------------------------------------

    public get tableName(): string {
        return this.targetMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get entity(): EntityMetadata | RelatedEntitiesMap {
        return this._entity ??= this.handleEntity()
    }

    // ------------------------------------------------------------------------

    public get column(): ColumnMetadata | RelatedColumnsMap {
        return this._column ??= this.handleColumn()
    }


    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): ForeignKeyReferencesJSON {
        return {
            entity: this.entityToJSON(),
            column: this.columnToJSON(),
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