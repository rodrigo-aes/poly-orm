import EntityMetadata from "../../../.."
import RelationMetadata from "../../RelationMetadata"
import { Collection } from "../../../../../../Entities"

// Types
import type {
    Target,
    EntityTarget,
    Constructor
} from "../../../../../../types"
import type { ColumnMetadata } from "../../../.."
import type { ConditionalQueryOptions } from '../../../../../../SQLBuilders'
import type { EntityTargetGetter } from "../../types"
import type { PolymorphicChildOptions } from "../types"
import type { PolymorphicHasManyMetadataJSON } from "./types"

export default class PolymorphicHasManyMetadata extends RelationMetadata {
    declare public readonly type: 'PolymorphicHasMany'
    public readonly fillMethod = 'Many'

    public related!: EntityTargetGetter

    public FK!: string
    public TK?: string

    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>> = Collection

    constructor(target: Target, options: PolymorphicChildOptions) {
        super(target)
        Object.assign(this, options)
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

    public get refCol(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.FK)
    }

    // ------------------------------------------------------------------------

    public get parentType(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get typeCol(): ColumnMetadata | undefined {
        if (this.TK) return this.relatedMetadata.columns.findOrThrow(this.TK)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): PolymorphicHasManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            FK: this.refCol.toJSON(),
            TK: this.typeCol?.toJSON(),
            scope: this.scope,
            collection: this.collection
        }
    }
}

export {
    type PolymorphicHasManyMetadataJSON
}