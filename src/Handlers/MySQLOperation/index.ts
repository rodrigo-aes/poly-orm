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
    type FindOneResult,
    type FindResult,
    type CountManyResult,
    type CreateResult,
    type CreateCollectMapOptions,
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
    FindOneResult,
    FindResult,
    CountManyResult,
    CreateResult,
    CreateCollectMapOptions,
    UpdateResult,
    DeleteResult
}