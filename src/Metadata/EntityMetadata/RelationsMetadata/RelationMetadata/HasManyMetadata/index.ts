import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, EntityTarget, Constructor } from "../../../../../types"
import type { Collection } from "../../../../../Entities"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type {
    HasManyOptions,
    HasManyRelatedGetter,
    HasManyMetadataJSON
} from "./types"

export default class HasManyMetadata extends RelationMetadata {
    public readonly fillMethod = 'Many'

    public related!: HasManyRelatedGetter
    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>>
    public FKName: string

    constructor(target: Target, options: HasManyOptions) {
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
    public toJSON(): HasManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.foreignKey.toJSON(),
            scope: this.scope,
            collection: this.collection
        }
    }
}

export type {
    HasManyOptions,
    HasManyRelatedGetter,
    HasManyMetadataJSON
}