import { MetadataHandler, type PolymorphicEntityMetadata } from "../Metadata"
import { BasePolymorphicEntity } from "../Entities"

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
import type {
    PolymorphicEntityTarget,
    EntityTarget,
} from "../types"

import type {
    CountManyQueryResult,
    CreateQueryResult,
    UpdateQueryResult,
    UpdateOrCreateQueryResult
} from "./types"

import type { Pagination } from "../Entities"

// Exceptions
import PolyORMException from "../Errors"

export default class PolymorphicRepository<
    T extends PolymorphicEntityTarget
> {
    protected metadata: PolymorphicEntityMetadata

    constructor(public target: T) {
        this.metadata = MetadataHandler.targetMetadata(this.target) as (
            PolymorphicEntityMetadata
        )
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    /**
     * Search a register in database and return a polymorphic 
     * entity instance case finded
     * @param pk - Entity primary key
     * @param mapTo - Switch data mapped return
     * @default - 'entity'
     * @returns - Entity instance or `null`
     */
    public findByPk(pk: any, mapTo: ResultMapOption = 'entity') {
        return new MySQL2QueryExecutionHandler(
            this.target,
            new FindByPkSQLBuilder<T>(
                this.target,
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
    * @returns - A polymorphic entity instance collection
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
    * @param mapTo @param mapTo - Switch data mapped return
    * @default 'entity'
    * @returns - A polymorphic entity instance or `null`
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
    * @returns - A polymorphic entity instance pagination collection
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
     * Create a source entity register in database and returns a polymorphic 
     * entity instance of created register
     * @param source - Source entity
     * @param attributes - Creation attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - Source or polymorphic entity instance
     */
    public create<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: (
            CreationAttributes<InstanceType<Source>> |
            InstanceType<T>
        ),
        mapTo?: MapTo
    ): Promise<CreateQueryResult<T, Source, MapTo>> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new CreateSQLBuilder(source, attributes as any) as any,
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<CreateQueryResult<T, Source, MapTo>>
    }

    // ------------------------------------------------------------------------

    /**
     * Create many resgisters in database and return a polymorphic or source 
     * entity instances collection for created resgiters
     * @param source - Source entity
     * @param attributes - An array list for each register source entity 
     * creation attributes
     * @param mapTo - Return options map to case `this` returns a collection
     * of polymorphic entities instances case `source` returns a 
     * collection of source entities instances 
     * @returns - A collection of source or polymorphic entities instances
     */
    public createMany<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: CreationAttributes<InstanceType<Source>>[],
        mapTo?: MapTo
    ): Promise<CreateQueryResult<T, Source, MapTo>[]> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new CreateSQLBuilder(source, attributes as any) as any,
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<CreateQueryResult<T, Source, MapTo>[]>
    }

    // ------------------------------------------------------------------------

    /**
     * Update all resgisters matched by conditional where optionsof the source 
     * entity in database with the data attributes
     * @param source - Source entity
     * @param attributes - Update attributes data
     * @param where - Conditional where options
     * @returns - A result header of the affected registers
     */
    public update<
        Source extends EntityTarget,
        Data extends InstanceType<T> | UpdateAttributes<InstanceType<Source>>
    >(
        source: Source,
        attributes: Data,
        where?: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<UpdateQueryResult<T, Source, Data>> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateSQLBuilder(
                source,
                attributes instanceof BasePolymorphicEntity
                    ? attributes.toSourceEntity()
                    : attributes,
                where as ConditionalQueryOptions<InstanceType<Source>>
            ),
            'raw'
        )
            .exec() as Promise<UpdateQueryResult<T, Source, Data>>
    }

    // ------------------------------------------------------------------------

    /**
     * Update a existent source entity register matched by attributes data or 
     * create a new 
     * @param source - Source entity
     * @param attributes - Update or create attributes data
     * @param mapTo - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - A polymorphic or source entity instance for updated or 
     * created register
     */
    public updateOrCreate<
        Source extends EntityTarget,
        MapTo extends 'this' | 'source' = 'this'
    >(
        source: Source,
        attributes: UpdateOrCreateAttibutes<InstanceType<Source>>,
        mapTo?: MapTo
    ): Promise<UpdateOrCreateQueryResult<T, Source, MapTo>> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new UpdateOrCreateSQLBuilder<any>(source, attributes),
            (mapTo ?? 'this') === 'this'
                ? this.target
                : 'entity'
        )
            .exec() as Promise<UpdateOrCreateQueryResult<T, Source, MapTo>>
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all source entity registers matched by conditional where 
     * options in database
     * @param source  - Source entity
     * @param where - Conditional where options
     * @returns - A result header of the affected register in database
     */
    public delete<Source extends EntityTarget>(
        source: Source,
        where: ConditionalQueryOptions<InstanceType<Source>>
    ): Promise<DeleteResult> {
        this.verifySource(source)

        return new MySQL2QueryExecutionHandler(
            source,
            new DeleteSQLBuilder(source, where),
            'raw'
        )
            .exec() as (
                Promise<DeleteResult>
            )
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private verifySource(source: EntityTarget): void {
        if (!this.metadata.entities[source.name]) (
            PolyORMException.Metadata.throw(
                'INVALID_POLYMORPHIC_SOURCE', source.name, this.target.name
            )
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