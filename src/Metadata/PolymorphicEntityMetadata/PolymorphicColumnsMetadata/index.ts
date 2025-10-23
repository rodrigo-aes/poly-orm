import MetadataArray from '../../MetadataArray'
import PolymorphicEntityMetadata from '..'
import EntityMetadata from '../../EntityMetadata'
import PolymorphicColumnMetadata, {
    type PolymorphicColumnMetadataJSON
} from './PolymorphicColumnMetadata'

// Types
import type { PolymorphicEntityTarget, EntityTarget } from '../../../types'
import type {
    PolymorphicColumnsMetadataJSON,
    IncludedColumns,
    IncludeColumnOptions
} from './types'

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../../Errors'

export default class PolymorphicColumnsMetadata extends MetadataArray<
    PolymorphicColumnMetadata
> {
    protected static readonly UNCLUDED_KEY: string = (
        'included-polymorphic-columns'
    )

    private _primary?: PolymorphicColumnMetadata
    private _foreignKeys?: PolymorphicColumnMetadata[]

    constructor(
        public target: PolymorphicEntityTarget,
        private _sources?: EntityMetadata[]
    ) {
        super(target)

        this.mergePrimaryKeys()
        this.buildTypeColumn()
        this.mergeIncluded()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): PolymorphicColumnMetadata {
        return this._primary = this._primary
            ?? this.find(({ primary }) => primary)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_PRIMARY_KEY', this.target.name
            )
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): PolymorphicColumnMetadata[] {
        return this._foreignKeys = this._foreignKeys ?? this.filter(
            ({ isForeignKey }) => isForeignKey
        )
    }

    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof PolymorphicColumnMetadata)[] {
        return ['name']
    }
    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_COLUMN'
    }


    // Privates ---------------------------------------------------------------
    private get targetMetadata(): PolymorphicEntityMetadata {
        return PolymorphicEntityMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    private get sources(): EntityMetadata[] {
        return this._sources = this._sources ?? (
            this.targetMetadata.sources.map(
                source => EntityMetadata.findOrThrow(source)
            )
        )
    }

    // ------------------------------------------------------------------------

    private get included(): IncludedColumns {
        return PolymorphicColumnsMetadata.included(this.target)
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static get KEY(): string {
        return 'polymorphic-columns-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public sourceColumns(source: EntityTarget): [string, string][] {
        return Object.entries(this.included).flatMap(([name, options]) => {
            const option = options.find(({ target }) => source === target)
            return option ? [[option.column, name]] : []
        })
    }

    // Privates ---------------------------------------------------------------
    private mergePrimaryKeys(): void {
        this.push(new PolymorphicColumnMetadata(
            this.target,
            'primaryKey',
            this.sources.map(meta => meta.columns.primary)
        ))
    }

    // ------------------------------------------------------------------------

    private buildTypeColumn(): void {
        this.push(new PolymorphicColumnMetadata(this.target, 'entityType'))
    }

    // ------------------------------------------------------------------------

    private mergeIncluded(): void {
        this.push(...Object.entries(this.included).map(
            ([name, options]) => new PolymorphicColumnMetadata(
                this.target,
                name,
                options.map(({ target, column }) => (
                    EntityMetadata.findOrThrow(target).columns.findOrThrow(
                        column
                    )
                ))
            )
        ))
    }

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static included(target: PolymorphicEntityTarget): IncludedColumns {
        return Reflect.getOwnMetadata(this.UNCLUDED_KEY, target) ?? {}
    }

    // ------------------------------------------------------------------------

    public static include(
        target: PolymorphicEntityTarget,
        name: string,
        options: IncludeColumnOptions
    ): void {
        Reflect.defineMetadata(
            this.UNCLUDED_KEY,
            { ...this.included(target), [name]: options },
            target
        )
    }
}

export {
    PolymorphicColumnMetadata,

    type PolymorphicColumnsMetadataJSON,
    type PolymorphicColumnMetadataJSON,
    type IncludedColumns,
    type IncludeColumnOptions
}