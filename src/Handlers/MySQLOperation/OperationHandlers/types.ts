import type { Entity, Target, Constructor } from "../../../types"
import { Collection, Pagination, PaginationInitMap } from "../../../Entities"
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

// Map Options ================================================================
export type ResultMapOption = (
    'entity' |
    'json' |
    'raw' |
    Target
)

// ----------------------------------------------------------------------------

export type MapOptions<M extends ResultMapOption = ResultMapOption> = {
    mapTo?: M
}

// Collections Map Options ====================================================
export type CollectionsMap<T extends Collection[]> = {
    [K in T[number]as K['__$alias']]: K
}

// ----------------------------------------------------------------------------

export type EntityCollectionsMap<T extends Entity> = CollectionsMap<
    T['__collections']
>

// ----------------------------------------------------------------------------

export type EntityCollectionAlias<T extends Entity> = (
    keyof EntityCollectionsMap<T>
)

// ----------------------------------------------------------------------------

export type EntityCollectOption<T extends Entity> = (
    Constructor<Collection> | EntityCollectionAlias<T> | undefined
)

// ----------------------------------------------------------------------------

export interface CollectMapOptions<
    T extends Entity,
    M extends ResultMapOption = 'entity',
    C extends EntityCollectOption<T> = EntityCollectOption<T>,
> extends MapOptions<M> {
    collection?: C
}

// ----------------------------------------------------------------------------

export type ResolveCollection<
    T extends Entity,
    C extends EntityCollectOption<T> = EntityCollectOption<T>
> = C extends Constructor<Collection>
    ? InstanceType<C>
    : C extends EntityCollectionAlias<T>
    ? EntityCollectionsMap<T>[C]
    : T['__defaultCollection']

// Pagination Map Options =====================================================
export type PaginationsMap<T extends Pagination[]> = {
    [K in T[number]as K['__$alias']]: K
}

// ----------------------------------------------------------------------------

export type EntityPaginationsMap<T extends Entity> = PaginationsMap<
    T['__paginations']
>

// ----------------------------------------------------------------------------

export type EntityPaginationsAlias<T extends Entity> = (
    keyof EntityPaginationsMap<T>
)

// ----------------------------------------------------------------------------

export type EntityPaginateOption<T extends Entity> = (
    typeof Pagination | EntityPaginationsAlias<T> | undefined
)

// ----------------------------------------------------------------------------

export interface PaginateMapOptions<
    T extends Entity,
    P extends EntityPaginateOption<T> = EntityPaginateOption<T>,
    C extends EntityCollectOption<T> = EntityCollectOption<T>,
> {
    pagination?: P
    collection?: C
}

// ----------------------------------------------------------------------------

export type ResolvePagination<
    T extends Entity,
    P extends EntityPaginateOption<T> = EntityPaginateOption<T>
> = P extends Constructor<Pagination>
    ? InstanceType<P>
    : P extends EntityPaginationsAlias<T>
    ? EntityPaginationsMap<T>[P]
    : T['__defaultPagination']

// Exec Options ===============================================================
export type ExecOptions<
    T extends Entity,
    B extends SQLBuilder,
    M extends MapOptions | CollectMapOptions<T> | PaginateMapOptions<T>
> = {
    target: Constructor<T>,
    sqlBuilder: B,
    mapOptions?: M,
    toSource?: boolean,
    pagination?: PaginationInitMap
}