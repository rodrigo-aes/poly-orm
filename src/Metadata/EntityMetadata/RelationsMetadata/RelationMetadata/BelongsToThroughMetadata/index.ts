import RelationMetadata from "../RelationMetadata"
import MetadataHandler from "../../../../MetadataHandler"

// Types
import type { Target, TargetMetadata } from "../../../../../types"
import type EntityMetadata from "../../.."
import type { ColumnMetadata } from "../../../ColumnsMetadata"
import type { PolymorphicColumnMetadata } from "../../../../PolymorphicEntityMetadata"
import type { ConditionalQueryOptions } from '../../../../../SQLBuilders'
import type { TargetGetter, EntityTargetGetter } from "../types"
import type {
    BelongsToThroughOptions,
    BelongsToThroughMetadataJSON
} from "./types"

export default class BelongsToThroughMetadata extends RelationMetadata {
    declare public readonly type: 'BelongsToThrough'
    public readonly fillMethod = 'One'

    public related!: TargetGetter
    public through!: EntityTargetGetter

    public FK!: string
    private _throughFK: string

    public scope?: ConditionalQueryOptions<any>

    constructor(
        target: Target,
        options: BelongsToThroughOptions
    ) {
        super(target)

        const { throughFK, ...rest } = options
        this._throughFK = throughFK
        Object.assign(this, rest)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get relatedTarget(): Target {
        return this.related()
    }

    // ------------------------------------------------------------------------

    public get relatedMetadata(): TargetMetadata {
        return MetadataHandler.targetMetadata(this.related())
    }

    // ------------------------------------------------------------------------

    public get relatedTable(): string {
        return this.relatedMetadata.tableName
    }

    // ------------------------------------------------------------------------

    public get refCol(): (
        ColumnMetadata | PolymorphicColumnMetadata
    ) {
        return this.relatedMetadata.columns.findOrThrow(this.FK)
    }

    // ------------------------------------------------------------------------

    public get throughMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(this.through())
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

    public get throughPK(): string {
        return `${this.throughAlias}.${this.throughMetadata.PK}`
    }

    // ------------------------------------------------------------------------

    public get throughCol(): ColumnMetadata {
        return this.throughMetadata.columns.findOrThrow(this._throughFK)
    }

    // ------------------------------------------------------------------------

    public get throughFK(): string {
        return `${this.throughAlias}.${this._throughFK}`
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public toJSON(): BelongsToThroughMetadataJSON {
        return {
            name: this.name,
            type: this.type,
            related: this.relatedMetadata.toJSON(),
            through: this.throughMetadata.toJSON(),
            FK: this.refCol.toJSON(),
            throughFK: this.throughCol.toJSON(),
            scope: this.scope
        }
    }
}

export type {
    BelongsToThroughOptions,
    BelongsToThroughMetadataJSON
}