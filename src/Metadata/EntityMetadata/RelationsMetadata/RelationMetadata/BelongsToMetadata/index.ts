import RelationMetadata from "../RelationMetadata"
import MetadataHandler from "../../../../MetadataHandler"

// Types
import type { Target, TargetMetadata } from "../../../../../types"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { PolymorphicColumnMetadata } from "../../../../PolymorphicEntityMetadata"
import type { TargetGetter } from "../types"
import type { BelongsToOptions, BelongsToMetadataJSON } from "./types"

export default class BelongsToMetadata extends RelationMetadata {
    declare public readonly type: 'BelongsTo'
    public readonly fillMethod = 'One'

    public related!: TargetGetter
    public scope?: ConditionalQueryOptions<any>
    public FK!: string

    constructor(target: Target, options: BelongsToOptions) {
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

    public get refCol(): ColumnMetadata | PolymorphicColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FK)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            FK: this.refCol.toJSON(),
            scope: this.scope
        }
    }
}

export type {
    BelongsToOptions,
    BelongsToMetadataJSON
}