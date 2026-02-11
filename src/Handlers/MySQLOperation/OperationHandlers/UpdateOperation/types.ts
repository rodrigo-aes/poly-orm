import type { Entity } from "../../../../types"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../../../../SQLBuilders"

export type UpdateResult<
    T extends Entity,
    A extends T | UpdateAttributes<T>
> = A extends T
    ? T
    : A extends UpdateAttributes<T>
    ? ResultSetHeader
    : never

