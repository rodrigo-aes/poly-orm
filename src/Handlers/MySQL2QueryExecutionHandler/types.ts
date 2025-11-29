import type { Target, EntityTarget } from "../../types"
import type { ResultSetHeader } from "mysql2"

import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CountSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder
} from "../../SQLBuilders"

import type { Collection, Pagination } from "../../Entities"

export type SQLBuilder = (
    FindByPkSQLBuilder<any> |
    FindSQLBuilder<any> |
    FindOneSQLBuilder<any> |
    PaginationSQLBuilder<any> |
    CountSQLBuilder<any> |
    UpdateSQLBuilder<any> |
    DeleteSQLBuilder<any> |
    CreateSQLBuilder<any> |
    UpdateOrCreateSQLBuilder<any>
)

import type { MySQL2RawData, RawData } from "../MySQL2RawDataHandler"

export type ResultMapOption = (
    'entity' |
    'json' |
    'raw' |
    Target
)

export type ExecOptions = {
    mapTo?: ResultMapOption
}

export type UnionExecResult<
    T extends Target,
    Builder extends SQLBuilder,
    MapTo extends ResultMapOption
> = (
        Builder extends FindSQLBuilder<T>
        ? FindResult<T, MapTo>
        : Builder extends FindOneSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends UpdateSQLBuilder<T>
        ? UpdateResult<T>
        : Builder extends DeleteSQLBuilder<T>
        ? DeleteResult
        : never
    )

export type ExecResult<
    T extends Target,
    Builder extends SQLBuilder,
    MapTo extends ResultMapOption
> = T extends EntityTarget
    ? (
        Builder extends PaginationSQLBuilder<T>
        ? PaginateResult<T>
        : Builder extends FindSQLBuilder<T>
        ? FindResult<T, MapTo>
        : Builder extends FindOneSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends FindByPkSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends CountSQLBuilder<T>
        ? CountResult
        : Builder extends FindByPkSQLBuilder<T>
        ? FindOneResult<T, MapTo>
        : Builder extends CreateSQLBuilder<T>
        ? CreateResult<(
            MapTo extends Target
            ? MapTo
            : T
        )>
        : Builder extends UpdateSQLBuilder<T>
        ? UpdateResult<(
            MapTo extends Target
            ? MapTo
            : T
        )>
        : Builder extends UpdateOrCreateSQLBuilder<T>
        ? UpdateOrCreateResult<(
            MapTo extends Target
            ? MapTo
            : T
        )>
        : Builder extends DeleteSQLBuilder<T>
        ? DeleteResult
        : never
    )
    : UnionExecResult<T, Builder, MapTo>

export type FindOneResult<
    T extends Target,
    MapTo extends ResultMapOption
> = (
        MapTo extends 'entity'
        ? InstanceType<T> | null
        : MapTo extends 'json'
        ? RawData<T> | null
        : MapTo extends 'raw'
        ? MySQL2RawData[]
        : MapTo extends Target
        ? InstanceType<MapTo>
        : InstanceType<T>
    )

export type FindResult<
    T extends Target,
    MapTo extends ResultMapOption
> = (
        MapTo extends 'entity'
        ? Collection<InstanceType<T>>
        : MapTo extends 'json'
        ? RawData<T>[]
        : MapTo extends 'raw'
        ? MySQL2RawData[]
        : MapTo extends Target
        ? Collection<InstanceType<MapTo>>
        : Collection<InstanceType<T>>
    )

export type PaginateResult<T extends Target> = Pagination<InstanceType<T>>

export type CountResult = { [Key: string]: number }

export type CreateResult<T extends Target> = (
    InstanceType<T> |
    Collection<InstanceType<T>>
)

export type UpdateResult<T extends Target> = (
    InstanceType<T> |
    ResultSetHeader
)

export type UpdateOrCreateResult<T extends Target> = InstanceType<T>

export type DeleteResult = {
    affectedRows: number,
    serverStatus: number
}