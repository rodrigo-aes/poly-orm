import BaseRepository from "../BaseRepository"
import { BasePolymorphicEntity } from "../../Entities"

// SQL Builders
import {
    CreateSQLBuilder,
    UpdateSQLBuilder,
    UpdateOrCreateSQLBuilder,
    DeleteSQLBuilder,

    type CreationAttributes,
    type UpdateAttributes,
    type UpdateOrCreateAttibutes,
    type ConditionalQueryOptions
} from "../../SQLBuilders"

// Handlers
import { MySQL2QueryExecutionHandler, type DeleteResult } from "../../Handlers"

// Types 
import type { Constructor } from "../../types"
import type { PolymorphicEntityMetadata } from "../../Metadata"
import type { Source, ResolveSource } from "../../Entities"
import type {
    CreateQueryResult,
    UpdateQueryResult,
    UpdateOrCreateQueryResult
} from "./types"

// Exceptions
import PolyORMException from "../../Errors"

export default class PolymorphicRepository<
    T extends BasePolymorphicEntity<any>
> extends BaseRepository<T> {
    constructor(
        /** @intenral */
        protected target: Constructor<T>
    ) {
        super(target)
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
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
        S extends Source<T>,
        M extends 'this' | 'source' = 'this'
    >(
        source: S,
        attributes?: CreationAttributes<InstanceType<ResolveSource<T, S>>>,
        mapTo?: M
    ): Promise<CreateQueryResult<Constructor<T>, S, M>> {
        return new MySQL2QueryExecutionHandler(
            this.resolveSource(source),
            new CreateSQLBuilder(source, attributes as any),
            (mapTo ?? 'this') === 'this' ? this.target : 'entity'
        )
            .exec() as Promise<CreateQueryResult<Constructor<T>, S, M>>
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
        S extends Source<T>,
        M extends 'this' | 'source' = 'this'
    >(
        source: S,
        attributes: CreationAttributes<InstanceType<ResolveSource<T, S>>>[],
        mapTo?: M
    ): Promise<CreateQueryResult<Constructor<T>, S, M>[]> {
        return new MySQL2QueryExecutionHandler(
            this.resolveSource(source),
            new CreateSQLBuilder(source, attributes as any) as any,
            (mapTo ?? 'this') === 'this' ? this.target : 'entity'
        )
            .exec() as Promise<CreateQueryResult<Constructor<T>, S, M>[]>
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
        S extends Source<T>,
        Att extends T | UpdateAttributes<InstanceType<ResolveSource<T, S>>>
    >(
        source: S,
        attributes: Att,
        where?: ConditionalQueryOptions<InstanceType<ResolveSource<T, S>>>
    ): Promise<UpdateQueryResult<Constructor<T>, S, Att>> {
        return new MySQL2QueryExecutionHandler(
            this.resolveSource(source),
            new UpdateSQLBuilder(
                source,
                attributes instanceof BasePolymorphicEntity
                    ? attributes.toSourceEntity()
                    : attributes,
                where
            ),
            'raw'
        )
            .exec() as Promise<UpdateQueryResult<Constructor<T>, S, Att>>
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
        S extends Source<T>,
        M extends 'this' | 'source' = 'this'
    >(
        source: S,
        attributes: UpdateOrCreateAttibutes<InstanceType<ResolveSource<T, S>>>,
        mapTo?: M
    ): Promise<UpdateOrCreateQueryResult<Constructor<T>, S, M>> {
        return new MySQL2QueryExecutionHandler(
            this.resolveSource(source),
            new UpdateOrCreateSQLBuilder<any>(source, attributes),
            (mapTo ?? 'this') === 'this' ? this.target : 'entity'
        )
            .exec() as Promise<UpdateOrCreateQueryResult<Constructor<T>, S, M>>
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all source entity registers matched by conditional where 
     * options in database
     * @param source  - Source entity
     * @param where - Conditional where options
     * @returns - A result header of the affected register in database
     */
    public delete<S extends Source<T>>(
        source: S,
        where: ConditionalQueryOptions<InstanceType<ResolveSource<T, S>>>
    ): Promise<DeleteResult> {
        return new MySQL2QueryExecutionHandler(
            this.resolveSource(source),
            new DeleteSQLBuilder(source, where),
            'raw'
        )
            .exec() as Promise<DeleteResult>
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private resolveSource<S extends Source<T>>(source: S): ResolveSource<
        T, S
    > {
        return (this.metadata as PolymorphicEntityMetadata).entities[(() => {
            switch (typeof source) {
                case "string": return source
                case "object": return source!.name
            }
        })()] as ResolveSource<T, S> | undefined ?? (() => {
            throw PolyORMException.Metadata.instantiate(
                'INVALID_POLYMORPHIC_SOURCE', source.name, this.target.name
            )
        })()
    }
}