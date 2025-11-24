import type { Target, Entity } from "../types"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes } from "../SQLBuilders"
import type { CountQueryOptions } from "../SQLBuilders"

export type UpdateQueryResult<
    T extends Target,
    Data extends InstanceType<T> | UpdateAttributes<InstanceType<T>>
> = (
        Data extends InstanceType<T>
        ? InstanceType<T>
        : ResultSetHeader
    )

export type CountManyQueryResult<
    T extends Entity,
    Opts extends CountQueryOptions<T>
> = { [K in keyof Opts]: number }