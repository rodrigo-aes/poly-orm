import type { EntityTarget, PolymorphicEntityTarget } from "../types"
import type { BaseEntity } from "../Entities"
import type { BasePolymorphicEntity } from "../Entities"
import type { ResultSetHeader } from "mysql2"
import type { UpdateAttributes, CountQueryOptions } from "../SQLBuilders"

export type UpdateQueryResult<
    T extends PolymorphicEntityTarget,
    Source extends EntityTarget,
    Data extends InstanceType<T> | UpdateAttributes<InstanceType<Source>>
> = (
        Data extends InstanceType<T>
        ? Data
        : Data extends UpdateAttributes<InstanceType<Source>>
        ? ResultSetHeader
        : never
    )



export type CreateQueryResult<
    T extends PolymorphicEntityTarget,
    Source extends EntityTarget,
    MapTo extends 'this' | 'source'
> = (
        MapTo extends 'this'
        ? InstanceType<T>
        : MapTo extends 'source'
        ? InstanceType<Source>
        : never
    )

export type UpdateOrCreateQueryResult<
    T extends PolymorphicEntityTarget,
    Source extends EntityTarget,
    MapTo extends 'this' | 'source'
> = CreateQueryResult<T, Source, MapTo>

export type CountManyQueryResult<
    T extends EntityTarget | PolymorphicEntityTarget,
    Opts extends CountQueryOptions<InstanceType<T>>
> = { [K in keyof Opts]: number }