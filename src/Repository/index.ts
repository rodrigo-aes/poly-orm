import BaseEntity, { type Pagination } from "../BaseEntity"

// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CountSQLBuilder,
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,

    type FindOneResult,
    type FindResult,
    type ResultMapOption,
    type DeleteResult,
} from "../Handlers"

// Types 
import type { EntityTarget, AsEntityTarget } from "../types"
import type { UpdateQueryResult, CountManyQueryResult } from "./types"
import type { ResultSetHeader } from "mysql2"

export default class Repository<T extends EntityTarget> {
    constructor(public target: T) { }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Search a entity register in database and return a instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public findByPk(pk: any, mapTo: ResultMapOption = 'entity') {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<AsEntityTarget<T>>(
                this.target as AsEntityTarget<T>,
                pk
            ),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     *  Search all register matched by options in database
     * @param options - Find options
     * @param mapTo @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance collection
     */
    public find(
        options?: FindQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindSQLBuilder(this.target, options),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
    *  Search the first register matched by options in database
    * @param options - Find one options
    * @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance or `null`
    */
    public findOne(
        options?: FindOneQueryOptions<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindOneSQLBuilder(this.target, options),
            mapTo
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public paginate(options: PaginationQueryOptions<InstanceType<T>>): (
        Promise<Pagination<InstanceType<T>>>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new PaginationSQLBuilder(this.target, options),
            'entity'
        )
            .exec() as Promise<Pagination<InstanceType<T>>>
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public async count(options: CountQueryOption<InstanceType<T>>) {
        return (
            await new MySQL2QueryExecutionHandler(
                this.target,
                CountSQLBuilder.countBuilder(
                    this.target,
                    options
                ),
                'json'
            )
                .exec()
        )
            .result
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public countMany<Opts extends CountQueryOptions<InstanceType<T>>>(
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            CountSQLBuilder.countManyBuilder(
                this.target,
                options
            ),
            'json'
        )
            .exec() as Promise<CountManyQueryResult<T, Opts>>
    }

    // ------------------------------------------------------------------------

    /**
     * Create a register in database and returns a entity instance by created
     * register
     * @param attributes - Entity creation attributes
     * @returns - A entity instance for created register
     */
    public create(
        attributes: CreationAttributes<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder<T>(
                this.target,
                attributes
            ),
            mapTo
        )
            .exec() as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a entity instance 
     * collection by created resgiters
     * @param attributes - An array list for each register entity creation
     * attributes
     * @returns - A entity instance collection for created registers
     */
    public createMany(
        attributes: CreationAttributes<InstanceType<T>>[],
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>[]> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder(
                this.target,
                attributes
            ),
            mapTo
        )
            .exec() as (
                Promise<InstanceType<T>[]>
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public async update<Data extends (
        BaseEntity & InstanceType<T> |
        UpdateAttributes<InstanceType<T>>
    )>(
        attributes: Data,
        where: ConditionalQueryOptions<InstanceType<T>>,
    ): Promise<UpdateQueryResult<T, Data>> {
        const header: ResultSetHeader = await new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateSQLBuilder(this.target, attributes, where),
            'raw'
        )
            .exec() as any

        return (
            (attributes as any) instanceof BaseEntity
                ? attributes
                : header
        ) as UpdateQueryResult<T, Data>

    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent register matched by attributes data or create a new
     * @param attributes - Update or create attributes data 
     * @returns - A entity instance for updated or created register
     */
    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<InstanceType<T>>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<InstanceType<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateOrCreateSQLBuilder<T>(
                this.target,
                attributes
            ),
            mapTo
        )
            .exec() as (
                Promise<InstanceType<T>>
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all registers matched by conditional where options in database
     * @param where - Conditional where options
     * @returns - A result header containing the count of affected registers
     */
    public delete(where: ConditionalQueryOptions<InstanceType<T>>): (
        Promise<DeleteResult>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new DeleteSQLBuilder(this.target, where),
            'raw'
        )
            .exec() as (
                Promise<DeleteResult>
            )
    }
}

export {
    type FindOneResult,
    type FindResult,
    type CountManyQueryResult,
    type ResultMapOption,
    type DeleteResult,
}