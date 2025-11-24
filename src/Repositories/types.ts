import type { Target } from "../types"
import type { Entity } from "../Entities"
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
    T extends Target,
    Opts extends CountQueryOptions<InstanceType<T>>
> = { [K in keyof Opts]: number }