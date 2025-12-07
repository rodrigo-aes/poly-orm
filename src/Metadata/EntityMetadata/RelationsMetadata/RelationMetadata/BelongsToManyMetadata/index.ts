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
import type {
    BelongsToManyRelatedGetter,
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
} from "./types"

export default class BelongsToManyMetadata extends RelationMetadata {
    public readonly fillMethod = 'Many'

    public related!: BelongsToManyRelatedGetter
    public joinTableMetadata: JoinTableMetadata
    public onDelete?: ForeignKeyActionListener
    public onUpdate?: ForeignKeyActionListener
    public scope?: ConditionalQueryOptions<any>
    public collection?: Constructor<Collection<any>> = Collection

    constructor(public target: EntityTarget, options: BelongsToManyOptions) {
        const { name, joinTable, ...opts } = options

        super(target, name)

        Object.assign(this, opts)
        this.joinTableMetadata = this.registerJoinTable(joinTable)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): EntityTarget {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get JTName(): string {
        return this.joinTableMetadata.tableName
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

    public get relatedMetadata(): EntityMetadata {
        return EntityMetadata.findOrBuild(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): JoinColumnMetadata {
        return this.joinTableMetadata.getTargetColumn(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedFKName(): string {
        return `${this.JTAlias}.${this.relatedForeignKey.name}`
    }

    // ------------------------------------------------------------------------

    public get parentForeignKey(): JoinColumnMetadata {
        return this.joinTableMetadata.getTargetColumn(this.target)
    }

    // ------------------------------------------------------------------------

    public get parentFKname(): string {
        return `${this.JTAlias}.${this.parentForeignKey.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToManyMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            joinTable: this.joinTableMetadata.toJSON(),
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
    BelongsToManyRelatedGetter,
    BelongsToManyOptions,
    BelongsToManyMetadataJSON
}