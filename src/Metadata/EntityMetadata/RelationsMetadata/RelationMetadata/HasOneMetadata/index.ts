import MetadataHandler from "../../../../MetadataHandler"
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, TargetMetadata } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { PolymorphicColumnMetadata } from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { TargetGetter } from "../types"
import type {
    HasOneOptions,
    HasOneMetadataJSON
} from "./types"

export default class HasOneMetadata extends RelationMetadata {
    declare public readonly type: 'HasOne'
    public readonly fillMethod = 'One'


    public related!: TargetGetter
    public scope?: ConditionalQueryOptions<any>
    public FK!: string

    constructor(target: Target, options: HasOneOptions) {
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
    public toJSON(): HasOneMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.RefCol.toJSON(),
            scope: this.scope
        }
    }
}

export type {
    HasOneOptions,
    HasOneMetadataJSON
}