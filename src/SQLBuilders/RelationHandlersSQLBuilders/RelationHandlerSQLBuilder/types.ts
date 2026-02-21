import type { Entity } from "../../../types"

import type { CreateAttributes } from "../../CreateSQLBuilder"
import type { UpdateAttributes } from "../../UpdateSQLBuilder"

export type Att<T extends Entity = Entity> = (
    CreateAttributes<T> |
    UpdateAttributes<T>
)

export type ResolveAtt<R extends Entity, A extends Att<R>> = (
    A extends CreateAttributes<R>
    ? CreateAttributes<R>
    : A extends UpdateAttributes<R>
    ? UpdateAttributes<R>
    : A extends CreateAttributes<R>
    ? CreateAttributes<R>
    : never
)