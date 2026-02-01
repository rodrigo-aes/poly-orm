import '../Metadata'

import Entity from "./Entity"
import PolymorphicEntity, {
    Column as PolymorphicColumn,
    PolymorphicRelation,
    CommonRelation,

    type IncludeColumnOptions,
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions
} from "./PolymorphicEntity"

import Column from "./Column"
import ComputedColumn from "./ComputedColumn"
import Primary from "./Primary"

import ForeignKey, {
    type ForeignKeyReferencedGetter,
    type ForeignKeyConstraintOptions
} from "./ForeignKey"

import Unique from "./Unique"
import Nullable from "./Nullable"
import Default from "./Default"
import AutoIncrement from "./AutoIncrement"
import Unsigned from "./Unsigned"

import Id from "./Id"
import PolymorphicId from "./PolymorphicId"

import ForeignId, {
    type ForeignIdRelatedGetter,
    type ForeignIdOptions
} from "./ForeignId"

import PolymorphicForeignId, {
    type PolymorphicForeignIdRelatedGetter,
    type PolymorphicForeignIdOptions
} from "./PolymorphicForeignId"

import PolymorphicTypeKey, {
    type PolymorphicTypeKeyRelateds
} from "./PolymorphicTypeKey"

import CreatedTimestamp from "./CreatedTimestamp"
import UpdatedTimestamp from "./UpdatedTimestamp"

import UseRepository from "./UseRepository"

import ComputedProperty, {
    type ComputedPropertyFunction
} from "./ComputedProperty"

import Scopes, { DefaultScope } from "./Scopes"

import Triggers from "./Triggers"
import DefaultCollection from "./DefaultCollection"
import Paginations, { DefaultPagination } from "./Paginations"

import {
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
} from "./Relations"

import {
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
    AfterBulkDelete
} from "./Hooks"

export {
    Entity,
    PolymorphicEntity,

    Column,
    PolymorphicColumn,
    CommonRelation,
    PolymorphicRelation,
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
    UseRepository,
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

    type IncludeColumnOptions,
    type IncludedCommonRelationOptions,
    type IncludePolymorphicRelationOptions,
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
}