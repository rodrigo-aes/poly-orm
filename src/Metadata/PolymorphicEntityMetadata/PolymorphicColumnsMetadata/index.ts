import MetadataArray from '../../MetadataArray'
import PolymorphicEntityMetadata from '..'
import EntityMetadata from '../../EntityMetadata'

import PolymorphicColumnMetadata, {
    type PolymorphicColumnMetadataJSON
} from './PolymorphicColumnMetadata'

// Types
import type {
    PolymorphicEntityTarget,
    StaticPolymorphicEntityTarget,
    EntityTarget,
} from '../../../types'
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
    private _sourcesColumns: { [K: string]: [string, string][] } = {}

    constructor(
        public target: PolymorphicEntityTarget,
        private _sources?: EntityMetadata[]
    ) {
        super(target)

        this.mergePK()
        this.buildTK()
        this.mergeIncluded()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): PolymorphicColumnMetadata {
        return this._primary ??= this.find(({ primary }) => primary)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_PRIMARY_KEY', this.target.name
            )
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): PolymorphicColumnMetadata[] {
        return this._foreignKeys ??= this.filter(
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
        return this._sources ??= this.targetMetadata.sources.map(
            source => EntityMetadata.findOrThrow(source)
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
        switch ((this.target as StaticPolymorphicEntityTarget).__$ROLE) {
            case 'INTERNAL': return this.internalSourceColumns(source)
            case 'EXTERNAL': return this.externalSourceColumns(source)
        }
    }

    // Privates ---------------------------------------------------------------
    private externalSourceColumns(source: EntityTarget): [string, string][] {
        return this._sourcesColumns[source.name] ??= (
            Object.entries(this.included).flatMap(([name, options]) => {
                const option = options?.find(({ target }) => source === target)
                return option ? [[option.column, name]] : []
            })
        )
    }

    // ------------------------------------------------------------------------

    private internalSourceColumns(source: EntityTarget): [string, string][] {
        return this._sourcesColumns[source.name] ??= this.flatMap(
            ({ name, sources }) => {
                const sourceCol = sources?.find(col => name === col.name && (
                    source.prototype instanceof col.target ||
                    source === col.target
                ))

                return sourceCol ? [[sourceCol.name, name]] : []
            }
        )
    }

    // ------------------------------------------------------------------------

    private mergePK(): void {
        this.push(new PolymorphicColumnMetadata(
            this.target, 'PK', this.sources.map(meta => meta.columns.primary)
        ))
    }

    // ------------------------------------------------------------------------

    private buildTK(): void {
        this.push(new PolymorphicColumnMetadata(this.target, 'TK'))
    }

    // ------------------------------------------------------------------------

    private mergeIncluded(): void {
        this.push(...(() => {
            switch ((this.target as StaticPolymorphicEntityTarget).__$ROLE) {
                case 'INTERNAL': return this.internalIncluded()
                case 'EXTERNAL': return this.externalIncluded()
            }
        })())
    }

    // ------------------------------------------------------------------------

    private externalIncluded(): PolymorphicColumnMetadata[] {
        return Object.entries(this.included).map(
            ([name, options]) => new PolymorphicColumnMetadata(
                this.target,
                name,
                (options ?? this.sources).map(source =>
                    source instanceof EntityMetadata
                        ? source.columns.findOrThrow(name)
                        : EntityMetadata
                            .findOrThrow(source.target)
                            .columns
                            .findOrThrow(source.column)
                )
            )
        )
    }

    // ------------------------------------------------------------------------

    private internalIncluded(): PolymorphicColumnMetadata[] {
        const included = new Set<string>()
        const columns = this.sources.flatMap(({ columns }) => columns)
        return columns.flatMap(column => included.has(column.name)
            ? []
            : (() => {
                included.add(column.name)
                return new PolymorphicColumnMetadata(
                    this.target,
                    column.name,
                    [column].concat(columns.filter(({ name, target }) =>
                        name === column.name && target !== column.target
                    ))
                )
            })()
        )
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
        options?: IncludeColumnOptions
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