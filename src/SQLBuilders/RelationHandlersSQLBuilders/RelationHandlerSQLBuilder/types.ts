import type { Entity } from "../../../types"

import type { CreateAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"
import type { UpdateOrCreateAttributes } from "../../UpdateOrCreateSQLBuilder"

export type Att<T extends Entity = Entity> = (
    CreateAttributes<T> |
    UpdateAttributes<T> |
    UpdateOrCreateAttributes<T>
)

export type ResolveAtt<R extends Entity, A extends Att<R>> = (
    A extends CreateAttributes<R>
    ? CreateAttributes<R>
    : A extends UpdateAttributes<R>
    ? UpdateAttributes<R>
    : A extends UpdateOrCreateAttributes<R>
    ? UpdateOrCreateAttributes<R>
    : never
)