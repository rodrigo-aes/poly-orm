import './Metadata'
import './MetadataArray'
import './MetadataMap'

import ConnectionsMetadata, {
    type PolyORMConnection
} from "./ConnectionsMetadata"

import EntityMetadata, {
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

    // Join Tables
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,

    // Hooks
    HooksMetadata,
    type HookType,

    // Scopes
    ScopesMetadata,
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

    // Relations
    RelationsMetadata,
    Relation,
    type RelationMetadata,
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
} from "./EntityMetadata"

import PolymorphicEntityMetadata, {
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,
    PolymorphicRelationsMetadata,

    type UnionEntitiesMap,
    type IncludeColumnOptions,
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions
} from "./PolymorphicEntityMetadata"

import { ColumnSchemaMetadata } from './DatabaseSchemaMetadata'

import MetadataHandler from "./MetadataHandler"
import TempMetadata from "./TempMetadata"

export {
    ConnectionsMetadata,
    type PolyORMConnection,

    EntityMetadata,
    PolymorphicEntityMetadata,
    DataType,
    ColumnsMetadata,
    ColumnMetadata,
    PolymorphicColumnsMetadata,
    PolymorphicColumnMetadata,
    PolymorphicRelationsMetadata,
    Relation,
    RelationsMetadata,
    JoinTableMetadata,
    JoinColumnsMetadata,
    JoinColumnMetadata,
    HooksMetadata,
    ScopesMetadata,
    TriggersMetadata,
    CollectionsMetadata,
    PaginationsMetadata,
    ComputedPropertiesMetadata,

    TempMetadata,
    MetadataHandler,
    ScopeMetadataHandler,
    CollectionsMetadataHandler,
    PaginationMetadataHandler,

    ColumnSchemaMetadata,

    type JoinTableRelated,

    type ForeignKeyReferencedGetter,
    type ForeignKeyActionListener,

    type RelationMetadata,
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

    type ForeignIdConfig,
    type PolymorphicForeignIdConfig,
    type PolymorphicTypeKeyRelateds,

    type HookType,

    type Scope,
    type ScopeFunction,

    type ColumnPattern,

    type UnionEntitiesMap,
    type IncludeColumnOptions,
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions,

    type TextLength,
    type IntegerLength,
    type JSONColumnConfig,
    type BitLength,
    type BlobLength,
    type ComputedType,
    type ComputedPropertyFunction,

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