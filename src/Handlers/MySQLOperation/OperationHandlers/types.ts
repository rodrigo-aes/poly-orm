import type { Entity, Target } from "../../../types"
import type { Collection } from "../../../Entities"
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