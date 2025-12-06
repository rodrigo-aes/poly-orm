import EntityMetadata from "../../../.."
import RelationMetadata from "../../RelationMetadata"

// Types
import type {
    Target,
    EntityTarget,
    Constructor
} from "../../../../../../types"
import type { Collection } from "../../../../../../Entities"
import type { ColumnMetadata } from "../../../.."
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'
import type {
    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "../types"
import type { PolymorphicHasManyMetadataJSON } from "./types"

export default class PolymorphicHasManyMetadata extends RelationMetadata {
    public readonly fillMethod = 'Many'

    public related!: PolymorphicChildRelatedGetter

    public FKName: string
    public TKName?: string

    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>>

    constructor(target: Target, options: PolymorphicChildOptions) {
        const { name, typeKey, foreignKey, ...opts } = options

        super(target, name)

        this.FKName = foreignKey
        this.TKName = typeKey
        Object.assign(this, opts)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.related())
    }

    // ------------------------------------------------------------------------

    public get foreignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FKName)
    }

    // ------------------------------------------------------------------------

    public get parentType(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get typeColumn(): ColumnMetadata | undefined {
        if (this.TKName) return this.relatedMetadata
            .columns
            .findOrThrow(this.TKName)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicHasManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.foreignKey.toJSON(),
            typeColumn: this.typeColumn?.toJSON(),
            scope: this.scope,
            collection: this.collection
        }
    }
}

export {
    type PolymorphicHasManyMetadataJSON
}