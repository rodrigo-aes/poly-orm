import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."
import { Collection } from "../../../../../Entities"

// Types
import type { EntityTarget, Constructor } from "../../../../../types"
import type {
    JoinTableMetadata,
    JoinColumnMetadata
} from "../../../JoinTablesMetadata"
import type { ForeignKeyActionListener } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { EntityTargetGetter } from "../types"
import type {
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
} from "./types"

export default class BelongsToManyMetadata extends RelationMetadata {
    declare public readonly type: 'BelongsToMany'
    public readonly fillMethod = 'Many'

    public related!: EntityTargetGetter
    public JTMetadata: JoinTableMetadata
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>> = Collection

    constructor(public target: EntityTarget, options: BelongsToManyOptions) {
        super(target)

        const { joinTable, ...rest } = options
        Object.assign(this, rest)
        this.JTMetadata = this.registerJoinTable(joinTable)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get JTName(): string {
        return this.JTMetadata.name
    }

    // ------------------------------------------------------------------------

    public get JTAlias(): string {
        return `__${this.JTName}JT`
    }

    // ------------------------------------------------------------------------

    public get JT(): string {
        return `${this.JTName} ${this.JTAlias}`
    }

    // ------------------------------------------------------------------------

    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get refCol(): JoinColumnMetadata {
        return this.JTMetadata.getTargetColumn(this.related())
    }

    // ------------------------------------------------------------------------

    public get FK(): string {
        return `${this.JTAlias}.${this.refCol.name}`
    }

    // ------------------------------------------------------------------------

    public get parentRefCol(): JoinColumnMetadata {
        return this.JTMetadata.getTargetColumn(this.target)
    }

    // ------------------------------------------------------------------------

    public get parentFK(): string {
        return `${this.JTAlias}.${this.parentRefCol.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            joinTable: this.JTMetadata.toJSON(),
            onDelete: this.onDelete,
            onUpdate: this.onDelete,
            scope: this.scope,
            collection: this.collection
        }
    }

    // Privates ---------------------------------------------------------------
    private registerJoinTable(name?: string) {
        return EntityMetadata.findOrThrow(this.target).addJoinTable(
            () => [
                {
                    target: this.target,
                    options: {
                        onDelete: this.onDelete,
                        onUpdate: this.onUpdate
                    }
                },
                {
                    target: this.related
                }
            ],
            name
        )
    }
}

export type {
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
}