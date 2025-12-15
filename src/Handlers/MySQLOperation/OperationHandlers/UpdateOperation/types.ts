import type { Entity } from "../../../../types"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../../../../SQLBuilders"

export type UpdateResult<
    T extends Entity,
    S extends T | UpdateAttributes<T>
> = S extends T
    ? T
    : S extends UpdateAttributes<T>
    ? ResultSetHeader
    : never

