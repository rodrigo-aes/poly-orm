import Metadata from '../Metadata'

// Objects
// Data Type
import DataType, {
    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,

    type DataTypeMetadataJSON,
    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType
} from './DataType'

// Columns Metadata
import ColumnsMetadata, {
    ColumnMetadata,

    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON
} from './ColumnsMetadata'

// Relations Metadata
import RelationsMetadata, {
    Relation,

    type RelationMetadata,
    type PolymorphicRelationMetadata,
    type ToOneRelationMetadata,
    type ToManyRelationMetadata,
    type RelatedEntitiesMap,

    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type HasOneOptions,
    type HasManyOptions,
    type HasOneThroughOptions,
    type HasManyThroughOptions,
    type BelongsToOptions,
    type BelongsToThroughOptions,
    type BelongsToManyOptions,
    type PolymorphicParentOptions,
    type PolymorphicChildOptions,

    type TargetGetter,
    type EntityTargetGetter,
    type PolymorphicTargetGetter,

    type RelationsMetadataJSON,
    type RelationMetadataJSON
} from './RelationsMetadata'

// JoinTables Metadata
import JoinTablesMetadata, {
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    type JoinTableRelated,
    type JoinTableRelatedsGetter,
    type JoinTableMetadataJSON
} from './JoinTablesMetadata'

// Hooks
import HooksMetadata, {
    type HookMetadataJSON,
    type HooksMetadataJSON,
    type HookType
} from './HooksMetadata'

// Scopes
import ScopesMetadata, {
    ScopeMetadata,
    ScopeMetadataHandler,

    type Scope,
    type ScopeFunction,
    type ScopesMetadataJSON
} from './ScopesMetadata'

// Computed Properties
import ComputedPropertiesMetadata, {
    type ComputedPropertyFunction,
    type ComputedPropertiesJSON
} from './ComputedPropertiesMetadata'

// Triggers
import TriggersMetadata from './TriggersMetadata'

// Collections
import CollectionsMetadata, {
    CollectionsMetadataHandler,
    type CollectionsMetadataJSON
} from './CollectionsMetadata'

// Pagintions
import PaginationsMetadata, {
    PaginationMetadataHandler,
    type PaginationsMetadataJSON
} from './PaginationsMetadata'

// Processes
import { EntityToJSONProcessMetadata } from '../ProcessMetadata'

// Handlers
import MetadataHandler from '../MetadataHandler'

// Types
import type { EntityTarget } from '../../types'
import type { PolyORMConnection } from '../ConnectionsMetadata'
import type { EntityMetadataJSON } from './types'


// Exceptions
import { type MetadataErrorCode } from '../../Errors'

export default class EntityMetadata extends Metadata {
    constructor(
        public target: EntityTarget,
        public tableName: string = target.name.toLowerCase()
    ) {
        super()
        MetadataHandler.register(this, target)
    }

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get name(): string {
        return this.target.name
    }

    // ------------------------------------------------------------------------

    public get connection(): PolyORMConnection {
        return MetadataHandler.getConnection(this.target)
    }

    // ------------------------------------------------------------------------

    public get columns(): ColumnsMetadata {
        return ColumnsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get relations(): RelationsMetadata {
        return RelationsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get joinTables(): JoinTablesMetadata {
        return JoinTablesMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get hooks(): HooksMetadata {
        return HooksMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get scopes(): ScopesMetadata {
        return ScopesMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get computedProperties(): ComputedPropertiesMetadata {
        return ComputedPropertiesMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get triggers(): TriggersMetadata {
        return TriggersMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get collections(): CollectionsMetadata {
        return CollectionsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get paginations(): PaginationsMetadata {
        return PaginationsMetadata.findOrBuild(this.target)
    }

    // ------------------------------------------------------------------------

    public get PK(): string {
        return this.columns.primary.name
    }

    // ------------------------------------------------------------------------

    public get FKs(): ColumnMetadata[] {
        return this.columns.foreignKeys
    }

    // ------------------------------------------------------------------------

    public get constrainedFKs(): ColumnMetadata[] {
        return this.columns.constrainedForeignKeys
    }

    // ------------------------------------------------------------------------

    public get dependencies(): EntityTarget[] {
        return this.constrainedFKs.flatMap(({ references }) =>
            references!.referenced()
        )
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static override get KEY(): string {
        return 'entity-metadata'
    }

    // Protecteds -------------------------------------------------------------
    protected static override get UNKNOWN_ERROR_CODE(): MetadataErrorCode {
        return 'UNKNOWN_ENTITY'
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public defineDefaultConnection(connection: (
        PolyORMConnection | string
    )): void {
        return MetadataHandler.setDefaultConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public defineTempConnection(connection: PolyORMConnection | string): void {
        return MetadataHandler.setTempConnection(connection, this.target)
    }

    // ------------------------------------------------------------------------

    public addJoinTable(
        relateds: JoinTableRelatedsGetter,
        name?: string
    ): JoinTableMetadata {
        const joinTable = new JoinTableMetadata(relateds, name)
        this.joinTables.push(joinTable)

        return joinTable
    }

    // ------------------------------------------------------------------------

    public toJSON(): EntityMetadataJSON {
        return EntityToJSONProcessMetadata.initialized
            ? this.buildJSON()!
            : EntityToJSONProcessMetadata.apply(() => this.buildJSON())
    }

    // Privates ---------------------------------------------------------------
    protected buildJSON(): EntityMetadataJSON | undefined {
        if (EntityToJSONProcessMetadata.shouldAdd(this.name)) return {
            target: this.target,
            name: this.name,
            tableName: this.tableName,
            columns: this.columns.toJSON(),
            relations: this.relations?.toJSON(),
            joinTables: this.joinTables?.map(table => table.toJSON()),
            hooks: this.hooks?.toJSON(),
            scopes: this.scopes?.toJSON(),
            computedProperties: this.computedProperties?.toJSON(),
            triggers: this.triggers?.toJSON(),
            collections: this.collections?.toJSON(),
            paginations: this.paginations?.toJSON(),
        }
    }
}

export {
    // Columns
    ColumnsMetadata,
    ColumnMetadata,

    type ColumnPattern,
    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,
    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType,

    // Relations
    RelationsMetadata,
    Relation,

    type RelationMetadata,
    type PolymorphicRelationMetadata,
    type ToOneRelationMetadata,
    type ToManyRelationMetadata,
    type RelatedEntitiesMap,

    type HasOneMetadata,
    type HasManyMetadata,
    type HasOneThroughMetadata,
    type HasManyThroughMetadata,
    type BelongsToMetadata,
    type BelongsToThroughMetadata,
    type BelongsToManyMetadata,
    type PolymorphicHasOneMetadata,
    type PolymorphicHasManyMetadata,
    type PolymorphicBelongsToMetadata,

    type HasOneOptions,
    type HasManyOptions,
    type HasOneThroughOptions,
    type HasManyThroughOptions,
    type BelongsToOptions,
    type BelongsToThroughOptions,
    type BelongsToManyOptions,
    type PolymorphicParentOptions,
    type PolymorphicChildOptions,

    type TargetGetter,
    type EntityTargetGetter,
    type PolymorphicTargetGetter,

    // Join Tables
    JoinTablesMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    // Hooks
    HooksMetadata,
    type HookType,

    // Scopes
    ScopesMetadata,
    ScopeMetadata,
    ScopeMetadataHandler,

    // Triggers
    TriggersMetadata,

    // Computed Properties
    ComputedPropertiesMetadata,
    type ComputedPropertyFunction,

    // Collections
    CollectionsMetadata,
    CollectionsMetadataHandler,

    // Paginations
    PaginationsMetadata,
    PaginationMetadataHandler,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    // Scopes
    type Scope,
    type ScopeFunction,

    // JSON Types
    type EntityMetadataJSON,
    type DataTypeMetadataJSON,
    type ColumnsMetadataJSON,
    type ColumnMetadataJSON,
    type ForeignKeyReferencesJSON,
    type RelationsMetadataJSON,
    type RelationMetadataJSON,
    type JoinTableMetadataJSON,
    type HookMetadataJSON,
    type HooksMetadataJSON,
    type ScopesMetadataJSON,
    type ComputedPropertiesJSON,
    type CollectionsMetadataJSON,
    type PaginationsMetadataJSON,

    // Data Type
    DataType,
    CHAR,
    VARCHAR,
    TEXT,
    INT,
    FLOAT,
    DECIMAL,
    DOUBLE,
    BOOLEAN,
    ENUM,
    SET,
    TIMESTAMP,
    DATETIME,
    DATE,
    TIME,
    YEAR,
    JSON,
    JSONReference,
    BIT,
    BINARY,
    VARBINARY,
    BLOB,
    COMPUTED,
}