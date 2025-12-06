import RelationMetadata from "../../RelationMetadata"
import EntityMetadata from "../../../.."

// Types
import type { Target, EntityTarget } from "../../../../../../types"
import type { ColumnMetadata } from "../../../.."
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'
import type {
    PolymorphicChildOptions,
    PolymorphicChildRelatedGetter
} from "../types"
import type { PolymorphicHasOneMetadataJSON } from "./types"

export default class PolymorphicHasOneMetadata extends RelationMetadata {
    public readonly fillMethod = 'One'

    public related!: PolymorphicChildRelatedGetter

    public FKName: string
    public TKName?: string

    public scope?: ConditionalQueryOptions<any>

    constructor(target: Target, options: PolymorphicChildOptions) {
        const { name, typeKey, foreignKey, ...opts } = options

        super(target, name)

        Object.assign(this, opts)

        this.FKName = foreignKey
        this.TKName = typeKey
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
    public toJSON(): PolymorphicHasOneMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            foreignKey: this.foreignKey.toJSON(),
            typeColumn: this.typeColumn?.toJSON(),
            scope: this.scope
        }
    }
}

export {
    type PolymorphicHasOneMetadataJSON
}