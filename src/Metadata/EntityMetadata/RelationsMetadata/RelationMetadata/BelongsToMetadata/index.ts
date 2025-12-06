import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."

// Types
import type { EntityTarget, Target } from "../../../../../types"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type {
    BelongsToOptions,
    BelongsToRelatedGetter,
    BelongsToMetadataJSON
} from "./types"

export default class BelongsToMetadata extends RelationMetadata {
    public readonly fillMethod = 'One'

    public related!: BelongsToRelatedGetter
    public scope?: ConditionalQueryOptions<any>
    public FKName: string

    constructor(target: Target, options: BelongsToOptions) {
        const { name, foreignKey, ...opts } = options

        super(target, name)

        Object.assign(this, opts)
        this.FKName = foreignKey
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

    public get relatedPK(): string {
        return this.relatedMetadata.columns.primary.name
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToMetadataJSON {
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
    BelongsToOptions,
    BelongsToRelatedGetter,
    BelongsToMetadataJSON
}