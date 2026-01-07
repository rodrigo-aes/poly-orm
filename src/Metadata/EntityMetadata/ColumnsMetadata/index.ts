import 'reflect-metadata'

import MetadataArray from '../../MetadataArray'

import ColumnMetadata, {
    type SQLColumnType,
    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
} from "./ColumnMetadata"

import type DataType from "../DataType"
import type { EntityTarget } from "../../../types"
import type { ColumnsMetadataJSON } from './types'

// Exceptions
import PolyORMException, { type MetadataErrorCode } from '../../../Errors'

export default class ColumnsMetadata extends MetadataArray<ColumnMetadata> {
    private _primary?: ColumnMetadata
    private _foreignKeys?: ColumnMetadata[]
    private _constrainedForeignKeys?: ColumnMetadata[]

    constructor(public target: EntityTarget, ...columns: ColumnMetadata[]) {
        super(target, ...columns)
        this.init()
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get primary(): ColumnMetadata {
        return this._primary
            ??= this.find(({ primary }) => primary)!
            ?? PolyORMException.Metadata.throw(
                'MISSING_PRIMARY_KEY', this.target.name
            )
    }

    // ------------------------------------------------------------------------

    public get foreignKeys(): ColumnMetadata[] {
        return this._foreignKeys ??= this.filter(
            ({ isForeignKey }) => isForeignKey
        )
    }

    // ------------------------------------------------------------------------

    public get constrainedForeignKeys(): ColumnMetadata[] {
        return this._constrainedForeignKeys ??= this.foreignKeys.filter(
            ({ references }) => references?.constrained
        )
    }

    // Protecteds -------------------------------------------------------------
    protected override get SEARCH_KEYS(): (keyof ColumnMetadata)[] {
        return ['name']
    }

    // ------------------------------------------------------------------------

    protected override get UNIQUE_MERGE_KEYS(): (keyof ColumnMetadata)[] {
        return this.SEARCH_KEYS
    }

    // ------------------------------------------------------------------------

    protected override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_COLUMN'
    }

    // Static Getters =========================================================
    // Protecteds -------------------------------------------------------------
    protected static override get KEY(): string {
        return 'columns-metadata'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public registerColumn(name: string, dataType: DataType) {
        return this.addR(new ColumnMetadata(this.target, name, dataType))[0]
    }

    // ------------------------------------------------------------------------

    public registerColumnPattern(
        name: string,
        pattern: ColumnPattern,
        ...rest: any[]
    ): ColumnMetadata {
        return this.addR(
            ColumnMetadata.buildPattern(this.target, name, pattern, ...rest)
        )[0]
    }

    // ------------------------------------------------------------------------

    public defineForeignKey(
        name: string,
        initMap: ForeignKeyReferencesInitMap
    ) {
        this.findOrThrow(name).defineForeignKey(initMap)
    }
}

export {
    ColumnMetadata,

    type SQLColumnType,
    type ColumnConfig,
    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencesInitMap,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,
    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
}