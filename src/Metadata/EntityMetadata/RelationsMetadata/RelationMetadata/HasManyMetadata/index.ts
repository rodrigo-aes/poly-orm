import MetadataHandler from "../../../../MetadataHandler"
import RelationMetadata from "../RelationMetadata"
import { Collection } from "../../../../../Entities"

// Types
import type { Target, TargetMetadata, Constructor } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { PolymorphicColumnMetadata } from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { TargetGetter } from "../types"
import type { HasManyOptions, HasManyMetadataJSON } from "./types"

export default class HasManyMetadata extends RelationMetadata {
    declare public readonly type: 'HasMany'
    public readonly fillMethod = 'Many'

    public related!: TargetGetter
    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>> = Collection
    public FK!: string

    constructor(target: Target, options: HasManyOptions) {
        super(target)
        Object.assign(this, options)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): Target {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): TargetMetadata {
        return MetadataHandler.targetMetadata(this.relatedTarget)
    }

    // ------------------------------------------------------------------------

    public get RefCol(): ColumnMetadata | PolymorphicColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FK)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.RefCol.toJSON(),
            scope: this.scope,
            collection: this.collection
        }
    }
}

export type {
    HasManyOptions,
    HasManyMetadataJSON
}