import BaseRepository from "../BaseRepository"
import { BaseEntity, type Pagination } from "../../Entities"

// SQL Builders
import {
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,
    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions,
} from "../../SQLBuilders"

// Handlers
import {
    MySQL2QueryExecutionHandler,

    type ResultMapOption,
    type DeleteResult,
} from "../../Handlers"

// Types 
import type { Constructor } from "../../types"
import type { UpdateQueryResult } from "../types"

export default class Repository<T extends BaseEntity> extends BaseRepository<
    T
> {
    constructor(
        /** @internal */
        protected target: Constructor<T>
    ) {
        super(target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Create a register in database and returns a entity instance by created
     * register
     * @param attributes - Entity creation attributes
     * @returns - A entity instance for created register
     */
    public create(
        attributes: CreationAttributes<T>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<T> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder<Constructor<T>>(
                this.target,
                attributes
            ),
            mapTo
        )
            .exec() as Promise<T>
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
        attributes: CreationAttributes<T>[],
        mapTo: ResultMapOption = 'entity'
    ): Promise<T[]> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new CreateSQLBuilder(this.target, attributes),
            mapTo
        )
            .exec() as Promise<T[]>

    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where options in database 
     * with the data attributes
     * @param attributes - Data update attributes
     * @param where - Conditional where options
     * @returns - A result set header with the count of affected registers
     */
    public async update(
        attributes: T | UpdateAttributes<T>,
        where?: ConditionalQueryOptions<T>,
    ): Promise<UpdateQueryResult<Constructor<T>, typeof attributes>> {
        const header = await new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateSQLBuilder(this.target, attributes, where),
            'raw'
        )
            .exec()

        return (
            attributes instanceof BaseEntity
                ? attributes
                : header
        ) as UpdateQueryResult<Constructor<T>, typeof attributes>

    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent register matched by attributes data or create a new
     * @param attributes - Update or create attributes data 
     * @returns - A entity instance for updated or created register
     */
    public updateOrCreate(
        attributes: UpdateOrCreateAttibutes<T>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<T> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new UpdateOrCreateSQLBuilder<Constructor<T>>(
                this.target,
                attributes
            ),
            mapTo
        )
            .exec() as Promise<T>

    }

    // ------------------------------------------------------------------------

    /**
     * Delete all registers matched by conditional where options in database
     * @param where - Conditional where options
     * @returns - A result header containing the count of affected registers
     */
    public delete(where: ConditionalQueryOptions<T>): (
        Promise<DeleteResult>
    ) {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new DeleteSQLBuilder(this.target, where),
            'raw'
        )
            .exec() as Promise<DeleteResult>
    }
}