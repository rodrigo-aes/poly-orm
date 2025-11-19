import PolymorphicEntityMetadata from "../../../../../PolymorphicEntityMetadata"
import RelationMetadata from "../../RelationMetadata"

// Handlers
import MetadataHandler from "../../../../../MetadataHandler"
import {
    InternalPolymorphicEntities
} from "../../../../../../Entities"

// Helpers
import GeneralHelper from "../../../../../../Helpers/GeneralHelper"

// Types
import type { Target, PolymorphicEntityTarget } from "../../../../../../types"
import type { ColumnMetadata } from "../../../../ColumnsMetadata"
import type {
    PolymorphicColumnMetadata,
    PolymorphicEntityMetadataJSON
} from "../../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'
import type { RelatedEntitiesMap, RelatedEntitiesMapJSON } from "../../types"
import type {
    PolymorphicParentOptions,
    PolymorphicParentRelatedGetter
} from "../types"
import type { PolymorphicBelongsToMetadataJSON } from "./types"

export default class PolymorphicBelongsToMetadata extends RelationMetadata {
    private _relatedMetadata?: PolymorphicEntityMetadata | RelatedEntitiesMap
    private _relatedTarget?: PolymorphicEntityTarget
    private _relatedTable?: string
    private _relatedTargetName?: string

    public related!: PolymorphicParentRelatedGetter
    public scope?: ConditionalQueryOptions<any>

    public FKName: string
    public TKName?: string

    constructor(
        target: Target,
        options: PolymorphicParentOptions
    ) {
        const { name, typeKey, foreignKey, ...opts } = options

        super(target, name)

        this.FKName = foreignKey
        this.TKName = typeKey
        Object.assign(this, opts)

        this.handleRegisterPolymorphicParent()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): PolymorphicEntityTarget {
        return this._relatedTarget ??= (
            this.relatedMetadata instanceof PolymorphicEntityMetadata
                ? this.relatedMetadata.target
                : InternalPolymorphicEntities.get(this.relatedTargetName)!
        )
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): (
        PolymorphicEntityMetadata | RelatedEntitiesMap
    ) {
        return this._relatedMetadata ??= this.getMetadata()
    }

    // ------------------------------------------------------------------------ 

    public get relatedTable(): string {
        return this._relatedTable ??= (
            this.relatedMetadata instanceof PolymorphicEntityMetadata
                ? this.relatedMetadata.tableName
                : `${this.target.name.toLowerCase()}_${this.name}`
        )
    }
    // ------------------------------------------------------------------------

    public get relatedTargetName(): string {
        return this._relatedTargetName ??= (
            this.relatedMetadata instanceof PolymorphicEntityMetadata
                ? this.relatedMetadata.target.name
                : GeneralHelper.toPascalCase(...this.relatedTable.split('_'))
        )
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata | PolymorphicColumnMetadata {
        return MetadataHandler.targetMetadata(this.target)
            .columns
            .findOrThrow(this.FKName)
    }

    // ------------------------------------------------------------------------

    public get typeColum(): (
        ColumnMetadata | PolymorphicColumnMetadata | undefined
    ) {
        if (this.TKName) return MetadataHandler.targetMetadata(this.target)
            .columns
            .findOrThrow(this.TKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicBelongsToMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedJSON(),
            foreignKey: this.foreignKey.toJSON(),
            typeColumn: this.typeColum?.toJSON(),
            scope: this.scope
        }
    }

    // Privates ---------------------------------------------------------------
    private getMetadata() {
        const related = this.related()

        return Array.isArray(related)
            ? Object.fromEntries(related.map(
                target => [target.name, MetadataHandler.targetMetadata(target)]
            ))
            : MetadataHandler.targetMetadata(
                related as PolymorphicEntityTarget
            )
    }

    // ------------------------------------------------------------------------

    private handleRegisterPolymorphicParent(): void {
        const related = this.related()
        if (Array.isArray(related)) new PolymorphicEntityMetadata(
            undefined,
            this.relatedTable,
            related
        )
    }

    // ------------------------------------------------------------------------

    private relatedJSON(): (
        PolymorphicEntityMetadataJSON | RelatedEntitiesMapJSON
    ) {
        return this.relatedMetadata instanceof PolymorphicEntityMetadata
            ? this.relatedMetadata.toJSON()
            : Object.fromEntries(Object.entries(this.relatedMetadata).map(
                ([key, metadata]) => [key, metadata.toJSON()]
            ))
    }
}

export {
    type PolymorphicBelongsToMetadataJSON
}