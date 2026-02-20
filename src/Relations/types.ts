import type OneRelationHandler from "./OneRelation"
import type ManyRelationHandler from "./ManyRelation"

export type RelationHandler = (
    OneRelationHandler<any, any> | ManyRelationHandler<any, any, any>
)