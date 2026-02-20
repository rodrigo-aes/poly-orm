import HasOneMetadata, { type HasOneOptions } from "./HasOneMetadata"
import HasManyMetadata, { type HasManyOptions } from "./HasManyMetadata"

import HasOneThroughMetadata, {
    type HasOneThroughOptions
} from "./HasOneThroughMetadata"

import HasManyThroughMetadata, {
    type HasManyThroughOptions
} from "./HasManyThroughMetadata"

import BelongsToMetadata, { type BelongsToOptions } from "./BelongsToMetadata"

import BelongsToThroughMetadata, {
    type BelongsToThroughOptions
} from "./BelongsToThroughMetadata"

import BelongsToManyMetadata, {
    type BelongsToManyOptions
} from "./BelongsToManyMetadata"

import {
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    type PolymorphicParentOptions,
    type PolymorphicChildOptions,
    type PolymorphicTargetGetter
} from "./PolymorphicRelations"

// Types
import type {
    RelatedEntitiesMap,
    RelationMetadata,
    RelationType,
    PolymorphicRelationMetadata,
    ToOneRelationMetadata,
    ToManyRelationMetadata,
    RelationMetadataJSON,
    TargetGetter,
    EntityTargetGetter
} from "./types"

// Exceptions
import PolyORMException from "../../../../Errors"

export default class Relation {
    constructor() {
        PolyORMException.Common.throw(
            'NOT_INSTANTIABLE_CLASS', this.constructor.name
        )
    }

    // Static Consts ==========================================================
    // Publics ----------------------------------------------------------------
    public static readonly HasOne = HasOneMetadata
    public static readonly HasMany = HasManyMetadata
    public static readonly HasOneThrough = HasOneThroughMetadata
    public static readonly HasManyThrough = HasManyThroughMetadata
    public static readonly BelongsTo = BelongsToMetadata
    public static readonly BelongsToThrough = BelongsToThroughMetadata
    public static readonly BelongsToMany = BelongsToManyMetadata
    public static readonly PolymorphicHasOne = PolymorphicHasOneMetadata
    public static readonly PolymorphicHasMany = PolymorphicHasManyMetadata
    public static readonly PolymorphicBelongsTo = PolymorphicBelongsToMetadata

    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static is<T extends RelationMetadata>(
        meta: T,
        type: RelationType
    ): boolean {
        return meta instanceof this[type]
    }

    // ------------------------------------------------------------------------

    public static valid<T extends RelationMetadata>(
        meta: T,
        type: RelationType
    ): T {
        return this.is(meta, type) ? meta : (() => {
            throw PolyORMException.Metadata.instantiate(
                'INVALID_RELATION', meta.type, meta.name, type
            )
        })()
    }
}

export type {
    RelationMetadata,
    PolymorphicRelationMetadata,
    ToOneRelationMetadata,
    ToManyRelationMetadata,
    RelationMetadataJSON,
    RelatedEntitiesMap,

    HasOneOptions,
    HasManyOptions,
    HasOneThroughOptions,
    HasManyThroughOptions,
    BelongsToOptions,
    BelongsToThroughOptions,
    BelongsToManyOptions,
    PolymorphicParentOptions,
    PolymorphicChildOptions,

    TargetGetter,
    EntityTargetGetter,
    PolymorphicTargetGetter
}