import RelationMetadata from "../RelationMetadata"
import EntityMetadata from "../../.."

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
} from "./types"

export default class BelongsToThroughMetadata extends RelationMetadata {
    public readonly fillMethod = 'One'

    public related!: BelongsToThroughRelatedGetter
    public through!: BelongsToThroughGetter

    public relatedFKName: string
    private _throughFKName: string

    public scope?: ConditionalQueryOptions<any>

    constructor(
        target: Target,
        options: BelongsToThroughOptions
    ) {
        const { name, foreignKey, throughForeignKey, ...opts } = options

        super(target, name)

        this.relatedFKName = foreignKey
        this._throughFKName = throughForeignKey
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

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): ColumnMetadata {
        return EntityMetadata.findOrThrow(this.target)
            .columns
            .findOrThrow(this.relatedFKName)
    }

    // ------------------------------------------------------------------------

    public get throughMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.through())
    }

    // ------------------------------------------------------------------------

    public get throughAlias(): string {
        return `__through${this.throughMetadata.target.name.toLowerCase()}`
    }

    // ------------------------------------------------------------------------

    public get throughTable(): string {
        return `${this.throughMetadata.tableName} ${this.throughAlias}`
    }

    // ------------------------------------------------------------------------

    public get throughPrimary(): string {
        return (
            `${this.throughAlias}.${this.throughMetadata.PK}`
        )
    }

    // ------------------------------------------------------------------------

    public get throughForeignKey(): ColumnMetadata {
        return this.throughMetadata.columns.findOrThrow(this._throughFKName)
    }

    // ------------------------------------------------------------------------

    public get throughFKName(): string {
        return `${this.throughAlias}.${this.throughForeignKey.name}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToThroughMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            through: this.throughMetadata.toJSON(),
            relatedForeignKey: this.relatedForeignKey.toJSON(),
            throughForeignKey: this.throughForeignKey.toJSON(),
            scope: this.scope
        }
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughRelatedGetter,
    BelongsToThroughGetter,
    BelongsToThroughMetadataJSON
}