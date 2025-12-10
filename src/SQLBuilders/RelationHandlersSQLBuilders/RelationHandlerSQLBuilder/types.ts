import type { Entity } from "../../../types"

import type {
    RelationCreationAttributes,
    RelationUpdateAttributes,
    RelationUpdateOrCreateAttributes
} from "../OneRelationHandlerSQLBuilder"

import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"
import type { UpdateOrCreateAttributes } from "../../UpdateOrCreateSQLBuilder"

export type Att<T extends Entity = Entity> = (
    CreationAttributes<T> |
    UpdateAttributes<T> |
    UpdateOrCreateAttributes<T>
)

export type RelationAtt<T extends Entity = Entity> = (
    RelationCreationAttributes<T> |
    RelationUpdateAttributes<T> |
    RelationUpdateOrCreateAttributes<T>
)

export type ResolveAtt<R extends Entity, A extends RelationAtt<R>> = (
    A extends RelationCreationAttributes<R>
    ? CreationAttributes<R>
    : A extends RelationUpdateAttributes<R>
    ? UpdateAttributes<R>
    : A extends RelationUpdateOrCreateAttributes<R>
    ? UpdateOrCreateAttributes<R>
    : never
)