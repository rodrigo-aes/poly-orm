import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type {
    HasOneOptions,
    HasOneRelatedGetter,
    HasOneMetadataJSON
} from "./types"

export default class HasOneMetadata extends RelationMetadata {
    public readonly fillMethod = 'One'

    public related!: HasOneRelatedGetter
    public scope?: ConditionalQueryOptions<any>
    public FKName: string

    constructor(target: Target, options: HasOneOptions) {
        const { name, foreignKey, ...opts } = options

        super(target, name)

        this.FKName = foreignKey
        Object.assign(this, opts)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.relatedTarget)
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): HasOneMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.foreignKey.toJSON(),
            scope: this.scope
        }
    }
}

export type {
    HasOneOptions,
    HasOneRelatedGetter,
    HasOneMetadataJSON
}