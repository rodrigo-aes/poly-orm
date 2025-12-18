import Metadata from "../Metadata"

import EntityMetadata, {
    HooksMetadata,
    ScopesMetadata,
    ComputedPropertiesMetadata,
    CollectionsMetadata,
    PaginationsMetadata,
} from "../EntityMetadata"

// Columns
import PolymorphicColumnsMetadata, {
    PolymorphicColumnMetadata,

    type PolymorphicColumnsMetadataJSON,
    type PolymorphicColumnMetadataJSON,
    type IncludedColumns,
    type IncludeColumnOptions
} from "./PolymorphicColumnsMetadata"

// Relations
import PolymorphicRelationsMetadata, {
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions
} from "./PolymorphicRelationsMetadata"

// Repository
import { PolymorphicRepository } from "../../Repositories"

// Handlers
import MetadataHandler from '../MetadataHandler'
import { EntityBuilder } from "../../Handlers"
import { EntityToJSONProcessMetadata } from "../ProcessMetadata"

// Helpers
import GeneralHelper from "../../Helpers/GeneralHelper"

// Types
import type { PolyORMConnection } from "../../Metadata"
import type { PolymorphicEntityTarget, EntityTarget } from "../../types"
import type {
    UnionEntitiesMap,
    SourcesMetadata,
    PolymorphicEntityMetadataJSON
} from "./types"

// Exceptions
import type { MetadataErrorCode } from '../../Errors'

export default class PolymorphicEntityMetadata extends Metadata {
    public target: PolymorphicEntityTarget
    public tableName: string

    private _entities?: UnionEntitiesMap
    private _sourcesMetadata?: SourcesMetadata

    public exclude?: string[] = []

    constructor(
        target: PolymorphicEntityTarget | undefined,
        tablename: string | undefined,
        private _sources: EntityTarget[] | (() => EntityTarget[])
    ) {
        if (!target && !tablename) throw new Error(
            'Polymorphic metadata needs a PolymorphicEntityTarget or tableName'
        )

        super()

        this.tableName = tablename ?? target!.name.toLocaleLowerCase()
        this.target = target ?? EntityBuilder.makeInternalPolymorphic(this)
        MetadataHandler.register(this, this.target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target?.name ?? GeneralHelper.toPascalCase(
            ...this.tableName.split('_')
        )
    }
    // ------------------------------------------------------------------------

    public get sources(): EntityTarget[] {
        return this._sources = typeof this._sources === 'function'
            ? this._sources()
            : this._sources
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return MetadataHandler.getConnection(this.target, false) ?? (
            this.getConnectionBySources()
        )
    }

    // ------------------------------------------------------------------------

    public get entities(): UnionEntitiesMap {
        return this._entities ??= Object.fromEntries(
            this.sources.map(target => [target.name, target])
        )
    }

    // ------------------------------------------------------------------------

    public get sourcesMetadata(): SourcesMetadata {
        return this._sourcesMetadata = this._sourcesMetadata
            ?? Object.fromEntries(this.sources.map(target => [
                target.name, EntityMetadata.findOrThrow(target)
            ]))
    }

    // ------------------------------------------------------------------------

    public get columns(): PolymorphicColumnsMetadata {
        return PolymorphicColumnsMetadata.find(this.target) ?? (
            new PolymorphicColumnsMetadata(
                this.target,
                Object.values(this.sourcesMetadata)
            )
        )
    }

    // ------------------------------------------------------------------------

    public get relations(): PolymorphicRelationsMetadata {
        return PolymorphicRelationsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get repository(): typeof PolymorphicRepository<any> {
        return MetadataHandler.getRepository(this.target)
            ?? PolymorphicRepository
    }

    // ------------------------------------------------------------------------

    public get hooks(): HooksMetadata {
        return HooksMetadata.findOrBuild(this.target!)
    }

    // ------------------------------------------------------------------------

    public get scopes(): ScopesMetadata {
        return ScopesMetadata.findOrBuild(this.target!)
    }

    // ------------------------------------------------------------------------

    public get computedProperties(): ComputedPropertiesMetadata {
        return ComputedPropertiesMetadata.findOrBuild(this.target!)
    }

    // ------------------------------------------------------------------------

    public get collections(): CollectionsMetadata {
        return CollectionsMetadata.findOrBuild(this.target!)
    }

    // ------------------------------------------------------------------------

    public get paginations(): PaginationsMetadata {
        return PaginationsMetadata.findOrBuild(this.target!)
    }

    // ------------------------------------------------------------------------

    public get PK(): string {
        return this.columns.primary.name
    }

    // ------------------------------------------------------------------------

    public get FKs(): PolymorphicColumnMetadata[] {
        return this.columns.filter(({ isForeignKey }) => isForeignKey)
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get KEY(): string {
        return 'polymorphic-entity-metadata'
    }

    // Protecteds -------------------------------------------------------------
    protected static override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_ENTITY'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getRepository(): PolymorphicRepository<any> {
        return new this.repository(this.target)
    }

    // ------------------------------------------------------------------------

    public defineDefaultConnection(connection: PolyORMConnection | string) {
        return MetadataHandler.setDefaultConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public defineTempConnection(connection: PolyORMConnection | string): void {
        return MetadataHandler.setTempConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public defineRepository(repository: typeof PolymorphicRepository<any>): (
        void
    ) {
        return MetadataHandler.setRepository(repository, this.target)
    }

    // ------------------------------------------------------------------------

    public toJSON(): PolymorphicEntityMetadataJSON {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()!
            : EntityToJSONProcessMetadata.apply(() => this.buildJSON())
    }

    // Privates ---------------------------------------------------------------

    protected buildJSON(): PolymorphicEntityMetadataJSON | undefined {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target,
            name: this.name,
            tableName: this.tableName,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            repository: this.repository,
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            collections: this.collections?.toJSON(),
            paginations: this.paginations?.toJSON(),
        }
    }

    // ------------------------------------------------------------------------

    private getConnectionBySources(): PolyORMConnection {
        const [{ connection }, ...rest] = Object.values(this.sourcesMetadata)

        if (rest.every(
            ({ connection: { name } }) => connection.name === name)
        ) (
            this.defineDefaultConnection(connection)
        )

        return connection
    }
}

export {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,
    PolymorphicRelationsMetadata,

    type PolymorphicEntityMetadataJSON,
    type PolymorphicColumnsMetadataJSON,
    type PolymorphicColumnMetadataJSON,
    type UnionEntitiesMap,
    type IncludedColumns,
    type IncludeColumnOptions,
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions
}