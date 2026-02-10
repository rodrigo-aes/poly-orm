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
import {
    MySQLOperation,

    type MapOptions,
    type CollectMapOptions,
    type PaginateMapOptions,
    type EntityPaginateOption,

    type FindOneResult,
    type FindResult,
    type PaginateResult,
    type CountManyResult,
} from "../Handlers"

// Types
import type { Collection, Pagination } from "../Entities"
import type { Constructor, Entity, TargetMetadata } from "../types"

export default abstract class BaseRepository<T extends Entity> {
    /** @internal */
    protected metadata: TargetMetadata<T>

    constructor(
        /** @internal */
        protected target: Constructor<T>
    ) {
        this.metadata = MetadataHandler.targetMetadata(this.target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Search a entity register in database and return a instance case finded
     * @param pk - Entity primary key
     * @param mapOptions - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public findByPk<M extends MapOptions>(pk: any, mapOptions?: M): Promise<
        FindOneResult<T, M>
    > {
        return MySQLOperation.FindByPk.exec({
            target: this.target,
            sqlBuilder: new FindByPkSQLBuilder(this.target, pk),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
    *  Search the first register matched by options in database
    * @param options - Find one options
    * @param mapOptions - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance or `null`
    */
    public findOne<M extends MapOptions>(
        options?: FindOneQueryOptions<T>,
        mapOptions?: M
    ): Promise<FindOneResult<T, M>> {
        return MySQLOperation.FindOne.exec({
            target: this.target,
            sqlBuilder: new FindOneSQLBuilder(this.target, options),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Search all register matched by options in database
     * @param options - Find options
     * @param mapTo @param mapTo - Switch data mapped return
     * @default 'entity'
     * @returns - A entity instance collection
     */
    public find<M extends CollectMapOptions<T>>(
        options?: FindQueryOptions<T>,
        mapOptions?: M
    ): Promise<FindResult<T, M>> {
        return MySQLOperation.Find.exec({
            target: this.target,
            sqlBuilder: new FindSQLBuilder(this.target, options),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
    *  Search all register matched by options in database and paginate
    * @param options - Find options
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A entity instance pagination collection
    */
    public paginate<M extends PaginateMapOptions<T>>(
        options: PaginationQueryOptions<T>,
        mapOptions?: M
    ): Promise<PaginateResult<T, M>> {
        return MySQLOperation.Paginate.exec({
            target: this.target,
            sqlBuilder: new PaginationSQLBuilder(this.target, options),
            mapOptions
        })
    }

    // ------------------------------------------------------------------------

    /**
     * Count database registers matched by options
     * @param options - Count options
     * @returns - The count number result
     */
    public async count(options: CountQueryOption<T>): Promise<number> {
        return await MySQLOperation.Count.execSingle(
            this.target,
            CountSQLBuilder.countBuilder(this.target, options)
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Make multiple count database registers matched by options
     * @param options - A object containing the count name key and count
     * options value
     * @returns - A object with count names keys and count results
     */
    public countMany<O extends CountQueryOptions<T>>(options: O): Promise<
        CountManyResult<T, O>
    > {
        return MySQLOperation.Count.execMany(
            this.target,
            CountSQLBuilder.countManyBuilder(this.target, options)
        )
    }
}