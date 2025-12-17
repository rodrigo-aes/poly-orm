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
    type UpdateOrCreateAttributes,
    type ConditionalQueryOptions
} from "../../SQLBuilders"

// Handlers
import {
    MySQLOperation,

    type CreateResult,
    type CreateCollectMapOptions,
    type UpdateResult,
    type DeleteResult,
} from "../../Handlers"

// Types 
import type { Constructor } from "../../types"
import type { Source, ResolveSource } from "../../Entities"

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
     * @param toSource - Return options map to case `this` returns a instance of 
     * polymorphic entity case `source` returns a instance of source entity 
     * @returns - Source or polymorphic entity instance
     */
    public create<S extends Source<T>, R extends 'this' | 'source' = 'this'>(
        source: S,
        attributes?: CreationAttributes<InstanceType<ResolveSource<T, S>>>,
        returns: R = 'this' as R
    ): Promise<R extends 'this'
        ? T
        : ResolveSource<T, S>
    > {
        const target = this.resolveSource(source)
        return new MySQLOperation.Create(
            target,
            new CreateSQLBuilder(target, attributes as any),
            undefined,
            returns === 'source'
        )
            .exec()
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
        M extends CreateCollectMapOptions<T>,
        R extends 'this' | 'source' = 'this'
    >(
        source: S,
        attributes: CreationAttributes<InstanceType<ResolveSource<T, S>>>[],
        mapTo?: M,
        returns: R = 'this' as R
    ): Promise<CreateResult<
        R extends 'this'
        ? T
        : ResolveSource<T, S>,
        M
    >> {
        const target = this.resolveSource(source)
        return new MySQLOperation.Create(
            target,
            new CreateSQLBuilder(target, attributes as any) as any,
            mapTo,
            returns === 'source'
        )
            .exec()
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
        A extends T | UpdateAttributes<ResolveSource<T, S>>
    >(
        source: S,
        attributes: A,
        where?: ConditionalQueryOptions<ResolveSource<T, S>>
    ): Promise<UpdateResult<T, A>> {
        const target = this.resolveSource(source)
        return new MySQLOperation.Update(
            target,
            new UpdateSQLBuilder(
                target,
                attributes instanceof BasePolymorphicEntity
                    ? attributes.toSourceEntity()
                    : attributes,
                where
            ),
        )
            .exec() as Promise<UpdateResult<T, A>>
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
        R extends 'this' | 'source' = 'this'
    >(
        source: S,
        attributes: UpdateOrCreateAttributes<InstanceType<ResolveSource<T, S>>>,
        returns: R
    ): Promise<
        R extends 'this'
        ? T
        : ResolveSource<T, S>
    > {
        const target = this.resolveSource(source)
        return new MySQLOperation.UpdateOrCreate(
            target,
            new UpdateOrCreateSQLBuilder<any>(target, attributes),
            undefined,
            returns === 'source'
        )
            .exec()
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
        const target = this.resolveSource(source)
        return new MySQLOperation.Delete(
            target,
            new DeleteSQLBuilder(target, where),
        )
            .exec()
    }

    // Privates ---------------------------------------------------------------
    /** @internal */
    private resolveSource<S extends Source<T>>(source: S): Constructor<
        ResolveSource<T, S>
    > {
        return this.metadata.entities[(() => {
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