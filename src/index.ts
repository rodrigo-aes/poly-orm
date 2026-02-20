import 'reflect-metadata'

// Global Types ===============================================================
import type {
    Target,
    EntityTarget,
    PolymorphicEntityTarget,
    CollectionTarget,

    Prop,
    TK,
    AutoGenProp,
    EntityProps,
    EntityPropsKeys,
    EntityRelations,
    EntityRelationsKeys,
    Related,
} from './types'

// Config =====================================================================
import type { PolyORMConfig } from './Config'

// Connection =================================================================
import MySQLConnection from './Connection'

// Metadata ===================================================================
import {
    DataType,

    type EntityMetadataJSON as EntityMetadata,
    type DataTypeMetadataJSON as DataTypeMetadata,
    type ColumnsMetadataJSON as ColumnsMetadata,
    type ColumnMetadataJSON as ColumnMetadata,
    type ForeignKeyReferencesJSON as ForeignKeyReferences,
    type RelationJSON as Relation,
    type RelationsMetadataJSON as RelationsMetadata,
    type JoinTableMetadataJSON as JoinTableMetadata,
    type HookMetadataJSON as HookMetadata,
    type HooksMetadataJSON as HooksMetadata,
    type ScopesMetadataJSON as ScopesMetadata,
    type ComputedPropertiesJSON as ComputedProperties,
    type CollectionsMetadataJSON as CollectionsMetadata,
} from './Metadata'

// Entities ===================================================================
import {
    BaseEntity,
    BasePolymorphicEntity,
    Collection,
    Pagination,
} from './Entities'

// Repositories ===============================================================
import { Repository, PolymorphicRepository } from './Repositories'

// Query Builders =============================================================
import {
    EntityQueryBuilder,
    PolymorphicEntityQueryBuilder,
    ConnectionQueryBuilder,

    FindOneQueryBuilder,
    FindQueryBuilder,
    BulkInsertQueryBuilder,
    InsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder,

    type SelectQueryBuilder,
    type CountQueryBuilder,
    type AndQueryBuilder,
    type CaseQueryBuilder,
    type ConditionalQueryHandler,
    type JoinQueryBuilder,

    type SelectQueryHandler,
    type CountQueryHandler,
    type AndQueryHandler,
    type CaseQueryHandler,
    type WhereQueryHandler,
    type JoinQueryHandler,
    type PaginateQueryBuilder
} from './QueryBuilder'

// Relations ================================================================
import type {
    HasOne as HasOneHandler,
    HasMany as HasManyHandler,
    BelongsTo as BelongsToHandler,
    HasOneThrough as HasOneThroughHandler,
    HasManyThrough as HasManyThroughHandler,
    BelongsToThrough as BelongsToThroughHandler,
    BelongsToMany as BelongsToManyHandler,
    PolymorphicHasOne as PolymorphicHasOneHandler,
    PolymorphicHasMany as PolymorphicHasManyHandler,
    PolymorphicBelongsTo as PolymorphicBelongsToHandler
} from './Relations'

// Triggers ===================================================================
import {
    Trigger,

    type TriggerTiming,
    type TriggerEvent,
    type TriggerOrientation,
    type TriggerActionType,
    type TriggerAction,
    type InsertIntoTableAction,
    type UpdateTableAction,
    type DeleteFromAction,
} from './Triggers'

// Decorators =================================================================
import {
    Meta,
    Entity,
    PolymorphicEntity,

    Column,
    ComputedColumn,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    PolymorphicId,
    ForeignId,
    PolymorphicForeignId,
    PolymorphicTypeKey,
    CreatedTimestamp,
    UpdatedTimestamp,

    HasOne,
    HasMany,
    HasOneThrough,
    HasManyThrough,
    BelongsTo,
    BelongsToThrough,
    BelongsToMany,

    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo,

    BeforeSync,
    AfterSync,
    BeforeFind,
    AfterFind,
    BeforeBulkFind,
    AfterBulkFind,
    BeforeCreate,
    AfterCreate,
    BeforeBulkCreate,
    AfterBulkCreate,
    BeforeUpdate,
    AfterUpdate,
    BeforeBulkUpdate,
    AfterBulkUpdate,
    BeforeDelete,
    AfterDelete,
    BeforeBulkDelete,
    AfterBulkDelete,

    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    DefaultCollection,
    Paginations,
    DefaultPagination,

    type ForeignKeyReferencedGetter,
    type ForeignKeyConstraintOptions,
    type ForeignIdRelatedGetter,
    type ForeignIdOptions,
    type PolymorphicForeignIdRelatedGetter,
    type PolymorphicForeignIdOptions,
    type PolymorphicTypeKeyRelateds,

    type ComputedPropertyFunction,

    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneOptions,
    type PolymorphicHasManyOptions,
    type PolymorphicBelongsToOptions
} from './Decorators'

// Database Schema ============================================================
import type DatabaseSchema from './DatabaseSchema'
import type { TableSchema, ColumnSchema } from './DatabaseSchema'

// Migrations =================================================================
import { Migration } from './Migrator'

// SQL Builders ===============================================================
import {
    Procedure,

    Op,
    Case,
    Exists,
    Cross,
    CurrentTimestamp,
    Literal,
    literal,
    li,

    type LiteralHandler,
    type Literals,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions,
    type CreateAttributes,
    type CreateOneOrManyAttributes,
    type CreateAttributesKey,
    type UpdateAttributes,
    type UpdateOrCreateAttributes,
    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,
    type RelationsOptions,
    type RelationOptions,
    type GroupQueryOptions,
    type OrderQueryOptions,
    type OrderQueryOption,

    type RelationHandlerSQLBuilder,
    type OneRelationHandlerSQLBuilder,
    type ManyRelationHandlerSQLBuilder,

    type CompatibleOperators,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
    type ExistsQueryOptions,
    // type CrossExistsQueryOptions,
} from './SQLBuilders'


// OUT Exports: ===============================================================
export {
    // Config -----------------------------------------------------------------
    type PolyORMConfig,

    // Connections ------------------------------------------------------------
    MySQLConnection,

    // Entities ---------------------------------------------------------------
    BaseEntity,
    BasePolymorphicEntity,
    Collection,
    Pagination,
    DataType,

    // Repositories -----------------------------------------------------------
    Repository,
    PolymorphicRepository,

    // QueryBuilders ----------------------------------------------------------
    EntityQueryBuilder,
    PolymorphicEntityQueryBuilder,
    ConnectionQueryBuilder,

    FindOneQueryBuilder,
    FindQueryBuilder,
    BulkInsertQueryBuilder,
    InsertQueryBuilder,
    UpdateQueryBuilder,
    UpdateOrCreateQueryBuilder,
    DeleteQueryBuilder,

    // Triggers ---------------------------------------------------------------
    Trigger,
    Procedure,

    // Migrations -------------------------------------------------------------
    Migration,

    // Decorators -------------------------------------------------------------
    Meta,
    Entity,
    PolymorphicEntity,

    Column,
    ComputedColumn,
    Primary,
    ForeignKey,
    Unique,
    Nullable,
    Default,
    AutoIncrement,
    Unsigned,

    Id,
    PolymorphicId,
    ForeignId,
    PolymorphicForeignId,
    PolymorphicTypeKey,
    CreatedTimestamp,
    UpdatedTimestamp,

    HasOne,
    HasMany,
    HasOneThrough,
    HasManyThrough,
    BelongsTo,
    BelongsToThrough,
    BelongsToMany,

    PolymorphicHasOne,
    PolymorphicHasMany,
    PolymorphicBelongsTo,

    BeforeSync,
    AfterSync,
    BeforeFind,
    AfterFind,
    BeforeBulkFind,
    AfterBulkFind,
    BeforeCreate,
    AfterCreate,
    BeforeBulkCreate,
    AfterBulkCreate,
    BeforeUpdate,
    AfterUpdate,
    BeforeBulkUpdate,
    AfterBulkUpdate,
    BeforeDelete,
    AfterDelete,
    BeforeBulkDelete,
    AfterBulkDelete,

    ComputedProperty,
    Scopes,
    DefaultScope,
    Triggers,
    DefaultCollection,
    Paginations,
    DefaultPagination,

    // Operators/Symbols ------------------------------------------------------
    Op,
    Case,
    Exists,
    Cross,
    CurrentTimestamp,
    Literal,
    literal,
    li,

    // Types ==================================================================
    type Literals,
    type LiteralHandler,

    // -- Targets -------------------------------------------------------------
    type EntityTarget,
    type PolymorphicEntityTarget,
    type Target,
    type CollectionTarget,

    // -- Metadata ------------------------------------------------------------
    type EntityMetadata,
    type DataTypeMetadata,
    type ColumnsMetadata,
    type ColumnMetadata,
    type ForeignKeyReferences,
    type Relation,
    type RelationsMetadata,
    type JoinTableMetadata,
    type HookMetadata,
    type HooksMetadata,
    type ScopesMetadata,
    type ComputedProperties,
    type CollectionsMetadata,

    // -- Database Schema -----------------------------------------------------
    type DatabaseSchema,
    type TableSchema,
    type ColumnSchema,

    type ForeignKeyReferencedGetter,
    type ForeignKeyConstraintOptions,
    type ForeignIdRelatedGetter,
    type ForeignIdOptions,
    type PolymorphicForeignIdRelatedGetter,
    type PolymorphicForeignIdOptions,
    type PolymorphicTypeKeyRelateds,

    type ComputedPropertyFunction,

    type HasOneHandler,
    type HasManyHandler,
    type BelongsToHandler,
    type HasOneThroughHandler,
    type HasManyThroughHandler,
    type BelongsToThroughHandler,
    type BelongsToManyHandler,
    type PolymorphicHasOneHandler,
    type PolymorphicHasManyHandler,
    type PolymorphicBelongsToHandler,

    type HasOneOptions,
    type HasOneRelatedGetter,

    type HasManyOptions,
    type HasManyRelatedGetter,

    type HasOneThroughOptions,
    type HasOneThroughRelatedGetter,
    type HasOneThroughGetter,

    type HasManyThroughOptions,
    type HasManyThroughRelatedGetter,
    type HasManyThroughGetter,

    type BelongToOptions,
    type BelongsToRelatedGetter,

    type BelongsToThroughOptions,
    type BelongsToThroughRelatedGetter,
    type BelongsToThroughGetter,

    type BelongsToManyOptions,
    type BelongsToManyRelatedGetter,

    type PolymorphicHasOneOptions,
    type PolymorphicHasManyOptions,
    type PolymorphicBelongsToOptions,

    type SelectQueryBuilder,
    type CountQueryBuilder,
    type AndQueryBuilder,
    type CaseQueryBuilder,
    type ConditionalQueryHandler,
    type JoinQueryBuilder,

    type SelectQueryHandler,
    type CountQueryHandler,
    type AndQueryHandler,
    type CaseQueryHandler,
    type WhereQueryHandler,
    type JoinQueryHandler,
    type PaginateQueryBuilder,

    type TriggerTiming,
    type TriggerEvent,
    type TriggerOrientation,
    type TriggerActionType,
    type TriggerAction,
    type InsertIntoTableAction,
    type UpdateTableAction,
    type DeleteFromAction,

    type Prop,
    type TK,
    type AutoGenProp,
    type EntityProps,
    type EntityPropsKeys,
    type EntityRelations,
    type EntityRelationsKeys,
    type Related,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CountCaseOptions,
    type CreateAttributes,
    type CreateOneOrManyAttributes,
    type CreateAttributesKey,
    type UpdateAttributes,
    type UpdateOrCreateAttributes,
    type SelectOptions,
    type SelectPropertyOptions,
    type SelectPropertyKey,
    type ConditionalQueryOptions,
    type AndQueryOptions,
    type OrQueryOptions,
    type RelationsOptions,
    type RelationOptions,
    type GroupQueryOptions,
    type OrderQueryOptions,
    type OrderQueryOption,

    type RelationHandlerSQLBuilder,
    type OneRelationHandlerSQLBuilder,
    type ManyRelationHandlerSQLBuilder,

    type CompatibleOperators,
    type CaseQueryOptions,
    type CaseQueryTuple,
    type WhenQueryOption,
    type ElseQueryOption,
    type ExistsQueryOptions,
    // type CrossExistsQueryOptions,
}