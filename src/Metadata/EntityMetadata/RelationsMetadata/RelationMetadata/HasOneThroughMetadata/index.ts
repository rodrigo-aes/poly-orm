import EntityMetadata from "../../.."
import RelationMetadata from "../RelationMetadata"

// Types
import type { Target, EntityTarget } from "../../../../../types"
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type {
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter,
    HasOneThroughMetadataJSON
} from "./types"

export default class HasOneThroughMetadata extends RelationMetadata {
    public readonly fillMethod = 'One'

    public related!: HasOneThroughRelatedGetter
    public through!: HasOneThroughGetter

    public relatedFKName: string
    private _throughFKName: string

    public scope?: ConditionalQueryOptions<any>

    constructor(target: Target, options: HasOneThroughOptions) {
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

    public get throughMetadata(): EntityMetadata {
        return EntityMetadata.findOrThrow(this.through())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get relatedForeignKey(): ColumnMetadata {
        return this.relatedMetadata.columns.findOrThrow(this.relatedFKName)
    }

    // ------------------------------------------------------------------------

    public get throughTable(): string {
        return `${this.throughMetadata.tableName} ${this.throughAlias}`
    }

    // ------------------------------------------------------------------------

    public get throughAlias(): string {
        return `__through${this.throughMetadata.target.name.toLowerCase()}`
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
    public toJSON(): HasOneThroughMetadataJSON {
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
    HasOneThroughOptions,
    HasOneThroughRelatedGetter,
    HasOneThroughGetter,
    HasOneThroughMetadataJSON
}