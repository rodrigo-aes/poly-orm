import type { Entity } from "../types";

import type { Collection } from "../Entities";

import type OneRelationHandler from "./OneRelation";
import type ManyRelationHandler from "./ManyRelation";

export type OneRelation<T extends Entity = Entity> = (
    OneRelationHandler<any, any> & T
)

export type ManyRelation<T extends Entity = Entity> = (
    ManyRelationHandler<any, any, any> & Collection<T>
)

export type RelationHandler<T extends Entity> = (
    OneRelation<T> | ManyRelation<T>
)