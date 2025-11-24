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
    Entity,
    Target,
    TargetMetadata
} from "../types"

import type { CountManyQueryResult } from "./types"

export default abstract class BaseRepository<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata

    constructor(
        /** @internal */
        protected target: Target
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
        T | null
    > {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<Target>(this.target, pk),
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
        options?: FindOneQueryOptions<T>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<T | null> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindOneSQLBuilder(this.target, options as any),
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
        options?: FindQueryOptions<T>,
        mapTo: ResultMapOption = 'entity'
    ): Promise<Collection<T>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindSQLBuilder(this.target, options as any),
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
    public paginate(options: PaginationQueryOptions<T>): Promise<
        Pagination<T>
    > {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new PaginationSQLBuilder(this.target, options as any),
            'entity'
        )
            .exec()
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public async count(options: CountQueryOption<T>): Promise<number> {
        return (
            await new MySQL2QueryExecutionHandler(
                this.target,
                CountSQLBuilder.countBuilder(this.target, options),
                'json'
            )
                .exec() as any
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
    public countMany<Opts extends CountQueryOptions<T>>(
        options: Opts
    ): Promise<CountManyQueryResult<T, Opts>> {
        return new MySQL2QueryExecutionHandler(
            this.target,
            CountSQLBuilder.countManyBuilder(this.target, options),
            'json'
        )
            .exec()
    }
}