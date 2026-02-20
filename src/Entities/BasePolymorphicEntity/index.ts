import Entity from "../Entity"

import {
    MetadataHandler,

    type PolymorphicEntityMetadata,
    type EntityMetadata,
} from "../../Metadata"

// Childs
import { InternalPolymorphicEntities } from "./Components"
import type { Collection, Pagination } from "../Components"

// Query Builder
import { PolymorphicEntityQueryBuilder } from "../../QueryBuilder"

// Decorators
import {
    PolymorphicColumn,
    CommonRelation,
    PolymorphicRelation,
} from "../../Decorators"

// Handlers
import { EntityBuilder } from "../../Handlers"

// Types
import type {
    PolymorphicEntityTarget,
    StaticPolymorphicEntityTarget,
    EntityTarget,
    Constructor,
} from "../../types"

import BaseEntity from "../BaseEntity"
import type { ResultSetHeader } from "mysql2"
import type { DeleteResult } from "../../Handlers"

import type {
    CreateAttributes,
    UpdateAttributes,
    ConditionalQueryOptions,
} from "../../SQLBuilders"

import { PolymorphicRepository } from "../../Repositories"
import type { CreateCollectMapOptions } from "../../Handlers"

import type {
    Source,
    ResolveSource,
    SourceEntities,
    SourceEntity,
    EntityNames,
    EntitiesMap
} from "./types"

/**
 * All polymorphic entities needs to extends BaseEntity class
 * @example
* class Authenticable extends BasePolymorphicEntity<[User, Admin]> {}
*/
export default abstract class BasePolymorphicEntity<
    S extends BaseEntity[]
> extends Entity {
    /** @internal */
    public static readonly __$ROLE: 'INTERNAL' | 'EXTERNAL' = 'EXTERNAL'

    declare readonly __defaultCollection: Collection<this>
    declare readonly __defaultPagination: Pagination<Collection<this>>

    /**
     * Entity primary key
     */
    public PK!: string | number

    /**
     * Entity type
     */
    public TK!: EntityNames<S>

    // Getters ================================================================
    // Publics ----------------------------------------------------------------
    public get sources(): EntitiesMap<S> {
        return (this.__$trueMetadata as PolymorphicEntityMetadata)
            .entities as any
    }

    // Privates -------------------------------------------------------------
    /** @internal */
    private get __$SPK(): string {
        return this.$__sourceTrueMetadata.PK
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private get __$whereSPK(): ConditionalQueryOptions<SourceEntity<S>> {
        return { [this.__$SPK]: this[this.__$pk as keyof this] } as (
            ConditionalQueryOptions<SourceEntity<S>>
        )
    }

    // ------------------------------------------------------------------------

    /** @internal */
    private get $__sourceTrueMetadata(): EntityMetadata {
        return MetadataHandler.targetMetadata(
            this.sources[this.TK] as EntityTarget
        )
    }

    // Static Getters =========================================================
    // Publics ----------------------------------------------------------------
    public static get Repository(): typeof PolymorphicRepository {
        return PolymorphicRepository
    }

    // Decorators -------------------------------------------------------------
    /**
     * Define polymorphic column to include decorator
     */
    public static get Column() {
        return PolymorphicColumn
    }

    // ------------------------------------------------------------------------

    /**
     * Define common relation to include decorator
     */
    public static get Relation() {
        return CommonRelation
    }

    // ------------------------------------------------------------------------

    /**
     * Define polymorphic relation to include decorator
     */
    public static get PolymorphicRelation() {
        return PolymorphicRelation
    }

    // Instance Methods =======================================================
    // Publics ----------------------------------------------------------------
    public getQueryBuilder<T extends BasePolymorphicEntity<any>>(
        this: T
    ): PolymorphicEntityQueryBuilder<T> {
        return new PolymorphicEntityQueryBuilder(
            this.constructor as Constructor<T>
        )
    }

    // ------------------------------------------------------------------------

    /**
     * Convert current polymorphic instance to source entity instance
     * @returns - A original entity instance
     */
    public toSource<T extends Source<S> | never = never>() {
        return EntityBuilder.buildPolymorphicSource(
            this.sources[this.TK],
            this
        ) as (
                T extends Source<S>
                ? ResolveSource<S, T>
                : SourceEntities<this>
            )
    }

    // ------------------------------------------------------------------------

    /**
     * Update or create a register of the source entity in database and return
     * the current polymorphic instance
     * @returns - Same polymorhic instance
     */
    public async save<T extends BasePolymorphicEntity<any>>(
        this: T,
        attributes?: UpdateAttributes<T>
    ): Promise<T> {
        const instance = await new BasePolymorphicEntity
            .Repository(this.constructor as Constructor<T>)
            .updateOrCreate(
                this.TK,
                attributes
                    ? this.fill(attributes).toSource()
                    : this.toSource(),
                'this'
            )

        await this.__$saveRelations()

        return instance
    }

    // ------------------------------------------------------------------------

    /**
     * Delete the register of the source entity in database
     */
    public async delete<T extends BasePolymorphicEntity<any>>(
        this: T
    ): Promise<void> {
        await new BasePolymorphicEntity
            .Repository(this.constructor as Constructor<T>)
            .delete(this.sources[this.TK], this.__$whereSPK as any)
    }

    // Privates ---------------------------------------------------------------


    // Static Methods =========================================================
    // Publics ----------------------------------------------------------------
    public static getQueryBuilder<T extends PolymorphicEntityTarget>(
        this: T
    ): PolymorphicEntityQueryBuilder<InstanceType<T>> {
        return new PolymorphicEntityQueryBuilder(this as any)
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
    public static create<
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: CreateAttributes<ResolveSource<T, S>>,
        mapTo: 'this' | 'source' = 'this'
    ): Promise<T> {
        return new (this as StaticPolymorphicEntityTarget<T>)
            .Repository(this)
            .create(source, attributes, mapTo)
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
    public static createMany<
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>,
        M extends CreateCollectMapOptions<T>,
        R extends 'this' | 'source'
    >(
        this: Constructor<T>,
        source: S,
        attributes: CreateAttributes<ResolveSource<T, S>>[],
        mapOptions?: M,
        returns: R = 'this' as R
    ) {
        return new (this as StaticPolymorphicEntityTarget<T>)
            .Repository(this)
            .createMany(source, attributes, mapOptions, returns)
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
    public static update<
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        attributes: UpdateAttributes<ResolveSource<T, S>>,
        where: ConditionalQueryOptions<ResolveSource<T, S>>
    ): Promise<ResultSetHeader> {
        return new (this as StaticPolymorphicEntityTarget<T>)
            .Repository(this)
            .update(source, attributes, where)
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
    public static updateOrCreate<
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>,
        R extends 'this' | 'source'
    >(
        this: Constructor<T>,
        source: S,
        attributes: CreateAttributes<ResolveSource<T, S>>,
        returns: R = 'this' as R
    ): Promise<
        R extends 'this'
        ? T
        : ResolveSource<T, S>
    > {
        return new (this as StaticPolymorphicEntityTarget<T>)
            .Repository(this)
            .updateOrCreate(source, attributes, returns)
    }

    // ------------------------------------------------------------------------

    /**
     * Delete all source entity registers matched by conditional where 
     * options in database
     * @param source  - Source entity
     * @param where - Conditional where options
     * @returns - A result header of the affected register in database
     */
    public static delete<
        T extends BasePolymorphicEntity<any>,
        S extends Source<T>
    >(
        this: Constructor<T>,
        source: S,
        where: ConditionalQueryOptions<ResolveSource<T, S>>
    ): Promise<DeleteResult> {
        return new (this as StaticPolymorphicEntityTarget<T>)
            .Repository(this)
            .delete(source, where)
    }
}

export {
    InternalPolymorphicEntities,

    type Source,
    type ResolveSource,
    type SourceEntities,
    type SourceEntity,
    type EntitiesMap,
    type EntityNames
}