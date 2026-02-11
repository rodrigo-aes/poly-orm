import {
    FindByPkOperation,
    FindOneOperation,
    FindOperation,
    PaginateOperation,
    CountOperation,
    CreateOperation,
    UpdateOperation,
    UpdateOrCreateOperation,
    DeleteOperation,

    type MapOptions,
    type CollectMapOptions,
    type EntityCollectOption,
    type PaginateMapOptions,
    type EntityPaginateOption,

    type FindOneResult,
    type FindResult,
    type PaginateResult,
    type CountManyResult,
    type CreateResult,
    type CreatinoCollectMapOptions,
    type UpdateResult,
    type DeleteResult
} from "./OperationHandlers"

import RelationOperationHandler from "./RelationOperationHandler"

export default abstract class MySQLOperation {
    public static FindByPk = FindByPkOperation
    public static FindOne = FindOneOperation
    public static Find = FindOperation
    public static Paginate = PaginateOperation
    public static Count = CountOperation
    public static Create = CreateOperation
    public static Update = UpdateOperation
    public static UpdateOrCreate = UpdateOrCreateOperation
    public static Delete = DeleteOperation
    public static Relation = RelationOperationHandler
}

export type {
    MapOptions,
    CollectMapOptions,
    EntityCollectOption,
    PaginateMapOptions,
    EntityPaginateOption,

    FindOneResult,
    FindResult,
    PaginateResult,
    CountManyResult,
    CreateResult,
    CreatinoCollectMapOptions as CreateCollectMapOptions,
    UpdateResult,
    DeleteResult
}