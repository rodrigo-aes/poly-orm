import type { CreationAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"
import type { UpdateOrCreateAttributes as UpdateOrCreateAttibutes } from "../../UpdateOrCreateSQLBuilder"
import type { Entity, ExcludeRelationAttributes } from "../../../types"

export type RelationCreationAttributes<T extends Entity = Entity> = (
    ExcludeRelationAttributes<CreationAttributes<T>>
)

export type RelationUpdateAttributes<T extends Entity = Entity> = Partial<
    RelationCreationAttributes<T>
>

export type RelationUpdateOrCreateAttributes<T extends Entity = Entity> = (
    ExcludeRelationAttributes<UpdateOrCreateAttibutes<T>>
)
