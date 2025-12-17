import BaseRepository from "../BaseRepository"

// SQL Builders
import {
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttributes,
    type ConditionalQueryOptions,
} from "../../SQLBuilders"

// Handlers
import {
    MySQLOperation,

    type CreateResult,
    type CreateCollectMapOptions,
    type UpdateResult,
    type DeleteResult
} from "../../Handlers"

// Types 
import type { Constructor } from "../../types"
import type { BaseEntity } from "../../Entities"

export default class Repository<T extends BaseEntity> extends BaseRepository<
    T
> {
    constructor(protected target: Constructor<T>) {
        super(target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a register in database and returns a instance
     * @param attributes - Entity creation attributes
     * @returns - Entity instance
     */
    public create(attributes: CreationAttributes<T>): Promise<T> {
        return MySQLOperation.Create.exec({
            target: this.target,
            sqlBuilder: new CreateSQLBuilder(
                this.target,
                attributes
            )
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a entity instance 
     * collection by created resgiters
     * @param attributes - An array list for each register entity creation
     * attributes
     * @returns - A entity instance collection for created registers
     */
    public createMany<M extends CreateCollectMapOptions<T>>(
        attributes: CreationAttributes<T>[],
        mapOptions?: M
    ): Promise<CreateResult<T, M>> {
        return MySQLOperation.Create.exec({
            target: this.target,
            sqlBuilder: new CreateSQLBuilder(this.target, attributes),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public async update<S extends T | UpdateAttributes<T>>(
        attributes: S,
        where?: ConditionalQueryOptions<T>,
    ): Promise<UpdateResult<T, S>> {
        return MySQLOperation.Update.exec({
            target: this.target,
            sqlBuilder: new UpdateSQLBuilder(this.target, attributes, where)
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent register matched by attributes data or create a new
     * @param attributes - Update or create attributes data 
     * @returns - A entity instance for updated or created register
     */
    public updateOrCreate(attributes: UpdateOrCreateAttributes<T>): Promise<
        T
    > {
        return MySQLOperation.UpdateOrCreate.exec({
            target: this.target,
            sqlBuilder: new UpdateOrCreateSQLBuilder(
                this.target,
                attributes
            )
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all registers matched by conditional where options in database
     * @param where - Conditional where options
     * @returns - A result header containing the count of affected registers
     */
    public delete(where: ConditionalQueryOptions<T>): Promise<DeleteResult> {
        return MySQLOperation.Delete.exec({
            target: this.target,
            sqlBuilder: new DeleteSQLBuilder(this.target, where)
        })
    }
}