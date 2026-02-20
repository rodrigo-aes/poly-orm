import type { Target, EntityTarget } from "../../../../types"
import type EntityMetadata from "../.."
import type { EntityMetadataJSON } from "../.."
import type PolymorphicEntityMetadata from "../../../PolymorphicEntityMetadata"
import type {
    PolymorphicEntityMetadataJSON
} from "../../../PolymorphicEntityMetadata"

import type HasOneMetadata from "./HasOneMetadata"
import type HasManyMetadata from './HasManyMetadata'
import type HasOneThroughMetadata from "./HasOneThroughMetadata"
import type HasManyThroughMetadata from "./HasManyThroughMetadata"
import type BelongsToMetadata from "./BelongsToMetadata"
import type BelongsToThroughMetadata from "./BelongsToThroughMetadata"
import type BelongsToManyMetadata from "./BelongsToManyMetadata"
import type {
    PolymorphicHasOneMetadata,
    PolymorphicHasManyMetadata,
    PolymorphicBelongsToMetadata,

    PolymorphicHasOneMetadataJSON,
    PolymorphicHasManyMetadataJSON,
    PolymorphicBelongsToMetadataJSON
} from './PolymorphicRelations'

import type { HasOneMetadataJSON } from "./HasOneMetadata"
import type { HasManyMetadataJSON } from "./HasManyMetadata"
import type { HasOneThroughMetadataJSON } from "./HasOneThroughMetadata"
import type { HasManyThroughMetadataJSON } from "./HasManyThroughMetadata"
import type { BelongsToMetadataJSON } from "./BelongsToMetadata"
import type { BelongsToThroughMetadataJSON } from "./BelongsToThroughMetadata"
import type { BelongsToManyMetadataJSON } from "./BelongsToManyMetadata"

export interface RelationOptions {
    name: string
}

export type RelatedEntitiesMap = {
    [key: string]: EntityMetadata | PolymorphicEntityMetadata
}

export type RelatedEntitiesMapJSON = {
    [key: string]: EntityMetadataJSON | PolymorphicEntityMetadataJSON
}

export type RelationMetadata = (
    HasOneMetadata |
    HasManyMetadata |
    HasOneThroughMetadata |
    HasManyThroughMetadata |
    BelongsToMetadata |
    BelongsToThroughMetadata |
    BelongsToManyMetadata |
    PolymorphicHasOneMetadata |
    PolymorphicHasManyMetadata |
    PolymorphicBelongsToMetadata
)

export type PolymorphicRelationMetadata = (
    PolymorphicHasOneMetadata |
    PolymorphicHasManyMetadata |
    PolymorphicBelongsToMetadata
)

export type ToOneRelationMetadata = Omit<RelationMetadata, (
    'HasManyMetadata' |
    'HasManyThroughMetadata' |
    'BelongsToManyMetadata' |
    'PolymorphicHasManyMetadata'
)>

export type ToManyRelationMetadata = Omit<RelationMetadata, (
    'HasOneMetadata' |
    'HasOneThroughMetadata' |
    'BelongsToMetadata' |
    'BelongsToThroughMetadata' |
    'PolymorphicHasOneMetadata' |
    'PolymorphicBelongsToMetadata'
)>

export type RelationType = (
    'HasOne' |
    'HasMany' |
    'HasOneThrough' |
    'HasManyThrough' |
    'BelongsTo' |
    'BelongsToThrough' |
    'BelongsToMany' |
    'PolymorphicHasOne' |
    'PolymorphicHasMany' |
    'PolymorphicBelongsTo'
)

export type BaseRelationMetadataJSON = {
    name: string,
    type: RelationType
}

export type RelationMetadataJSON = (
    PolymorphicHasOneMetadataJSON |
    PolymorphicHasManyMetadataJSON |
    PolymorphicBelongsToMetadataJSON |
    HasOneMetadataJSON |
    HasManyMetadataJSON |
    HasOneThroughMetadataJSON |
    HasManyThroughMetadataJSON |
    BelongsToMetadataJSON |
    BelongsToThroughMetadataJSON |
    BelongsToManyMetadataJSON
)

export type TargetGetter = () => Target
export type EntityTargetGetter = () => EntityTarget