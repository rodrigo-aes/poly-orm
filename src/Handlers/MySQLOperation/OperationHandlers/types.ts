import type { Entity, Target, Constructor } from "../../../types"
import type { Collection, PaginationInitMap } from "../../../Entities"
import type { FillMethod } from "../../MySQLDataHandler"
import type {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CountSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder
} from "../../../SQLBuilders"

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

export type ResultMapOption = (
    'entity' |
    'json' |
    'raw' |
    Target
)

export type MapOptions<M extends ResultMapOption = 'entity'> = {
    mapTo?: M
}

export interface CollectMapOptions<
    T extends Entity,
    M extends ResultMapOption = ResultMapOption,
    C extends Collection<T> | undefined = undefined
> extends MapOptions<M> {
    collection?: C
}

export type ExecOptions<
    T extends Entity,
    B extends SQLBuilder,
    M extends MapOptions | CollectMapOptions<T> | never
> = {
    target: Constructor<T>,
    sqlBuilder: B,
    mapOptions?: M,
    toSource?: boolean,
    pagination?: PaginationInitMap
}