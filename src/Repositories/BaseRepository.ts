// Handlers
import { MetadataHandler } from "../Metadata"

// SQL Builders
import {
    FindByPkSQLBuilder,
    FindOneSQLBuilder,
    FindSQLBuilder,
    PaginationSQLBuilder,
    CountSQLBuilder,

    type FindOneQueryOptions,
    type FindQueryOptions,
    type PaginationQueryOptions,
    type CountQueryOption,
    type CountQueryOptions,
} from "../SQLBuilders"

// Handlers
import { MySQL2QueryExecutionHandler, type ResultMapOption } from "../Handlers"

// Types
import type { Collection, Pagination } from "../Entities"

import type {
    EntityTarget,
    PolymorphicEntityTarget,
    TargetMetadata
} from "../types"

import type { CountManyQueryResult } from "./types"

export default abstract class BaseRepository<
    T extends EntityTarget | PolymorphicEntityTarget
> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    constructor(
        /** @internal */
        protected target: T
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Search a entity register in database and return a instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public findByPk(pk: any, mapTo: ResultMapOption = 'entity'): Promise<
        InstanceType<T> | null
    > {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<T>(this.target, pk),
            mapTo
        )
            .exec() as Promise<InstanceType<T> | null>
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
    ): Promise<InstanceType<T> | null> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindOneSQLBuilder(this.target, options),
            mapTo
        )
            .exec() as Promise<InstanceType<T> | null>
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
    ): Promise<Collection<InstanceType<T>>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindSQLBuilder(this.target, options),
            mapTo
        )
            .exec() as Promise<Collection<InstanceType<T>>>
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
    public async count(options: CountQueryOption<InstanceType<T>>): Promise<
        number
    > {
        return (
            await new MySQL2QueryExecutionHandler(
                this.target,
                CountSQLBuilder.countBuilder(this.target, options),
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
            CountSQLBuilder.countManyBuilder(this.target, options),
            'json'
        )
            .exec() as Promise<CountManyQueryResult<T, Opts>>
    }
}